const request = require('supertest');
const app = require('../server'); // Asegúrate de que server.js exporte la app
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/auth/register debe registrar un usuario', async () => {
        // Simula el comportamiento de hashing de contraseña y consulta a la base de datos
        bcrypt.hash.mockResolvedValue('hashed_password');
        db.query.mockResolvedValue([{ insertId: 1 }]);

        // Llama a la ruta de registro
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', password: 'password123' });

        // Verifica que todo ocurra según lo esperado
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Usuario registrado correctamente' });
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(db.query).toHaveBeenCalledWith(
            'INSERT INTO staff(first_name,last_name,address_id,store_id,username, password) VALUES (\' \',\' \',3,1,?,?)',
            ['testuser', 'hashed_password']
        );
    });

    test('POST /api/auth/login debe devolver un token si las credenciales son correctas', async () => {
        const mockUser = { id: 1, username: 'testuser', password: 'hashed_password' };

        // Simula la respuesta de la base de datos y las funciones de bcrypt y jwt
        db.query.mockResolvedValue([[mockUser]]);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('fake_token');

        // Llama a la ruta de inicio de sesión
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' });

        // Verifica que todo ocurra según lo esperado
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ token: 'fake_token' });
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM staff WHERE username = ?', ['testuser']);
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser.id, username: mockUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    test('POST /api/auth/login debe fallar con credenciales incorrectas', async () => {
        // Simula que no se encontró un usuario
        db.query.mockResolvedValue([[]]);

        // Llama a la ruta de inicio de sesión
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'invaliduser', password: 'password123' });

        // Verifica que todo ocurra según lo esperado
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Usuario no encontrado' });
    });

    test('POST /api/auth/login debe fallar con contraseña incorrecta', async () => {
        const mockUser = { id: 1, username: 'testuser', password: 'hashed_password' };

        // Simula la respuesta de la base de datos y un intento de comparación fallido
        db.query.mockResolvedValue([[mockUser]]);
        bcrypt.compare.mockResolvedValue(false);

        // Llama a la ruta de inicio de sesión
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'wrongpassword' });

        // Verifica que todo ocurra según lo esperado
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Contraseña incorrecta' });
    });
});
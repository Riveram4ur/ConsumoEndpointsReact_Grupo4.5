// tests/auth.service.test.js
const AuthService = require('../services/auth.service');
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    describe('register', () => {
        it('debería hashear la contraseña y registrar al usuario', async () => {
            const mockUsername = 'testuser';
            const mockPassword = 'testpassword';
            const mockHashedPassword = 'hashedpassword';

            bcrypt.hash.mockResolvedValue(mockHashedPassword);
            db.query.mockResolvedValue();

            const result = await AuthService.register(mockUsername, mockPassword);

            expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
            expect(db.query).toHaveBeenCalledWith(
                'INSERT INTO staff(first_name,last_name,address_id,store_id,username, password) VALUES (\' \',\' \',3,1,?,?)',
                [mockUsername, mockHashedPassword]
            );
            expect(result).toEqual({ message: 'Usuario registrado correctamente' });
        });

        it('debería lanzar un error si el registro falla', async () => {
            db.query.mockRejectedValue(new Error('Database error'));

            await expect(AuthService.register('user', 'pass')).rejects.toThrow('Error al registrar el usuario');
        });
    });

    describe('login', () => {
        it('debería devolver un token si las credenciales son correctas', async () => {
            const mockUsername = 'mike';
            const mockPassword = 'Admin.123';
            const mockUser = { id: 1, username: mockUsername, password: 'hashedpassword' }; // id definido
            const mockToken = 'testtoken';

            // Configurar correctamente los mocks
            db.query.mockResolvedValue([[mockUser]]);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(mockToken);

            const result = await AuthService.login(mockUsername, mockPassword);

            // Verificar que `jwt.sign` se llame correctamente
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM staff WHERE username = ?', [mockUsername]);
            expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockUser.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: mockUser.id, username: mockUser.username }, // id: 1
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            expect(result).toEqual({ token: mockToken });
        });

        it('debería lanzar un error si el usuario no es encontrado', async () => {
            db.query.mockResolvedValue([[]]);
            await expect(AuthService.login('user', 'pass')).rejects.toThrow('Usuario no encontrado');
        });

        it('debería lanzar un error si la contraseña es incorrecta', async () => {
            const mockUsername = 'mike';
            const mockPassword = 'testpassword';
            const mockUser = { id: 1, username: mockUsername, password: 'hashedpassword' };
            db.query.mockResolvedValue([[mockUser]]);
            bcrypt.compare.mockResolvedValue(false);
            await expect(AuthService.login(mockUsername, mockPassword)).rejects.toThrow('Contraseña incorrecta');
        });
    });
});
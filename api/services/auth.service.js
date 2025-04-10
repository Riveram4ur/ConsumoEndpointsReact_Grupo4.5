// services/auth.service.js
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.entity');

class AuthService {
    // Registrar un usuario
    static async register(username, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                'INSERT INTO staff(first_name, last_name, address_id, store_id, username, password) VALUES (\' \', \' \', 3, 1, ?, ?)',
                [username, hashedPassword]
            );
            return { message: 'Usuario registrado correctamente' };
        } catch (error) {
            console.error('🧨 Error en register:', error); // 👈 Esto te mostrará el error real
            throw new Error('Error al registrar el usuario');
        }
    }

    // Iniciar sesión
    static async login(username, password) {
        try {
            const [rows] = await db.query('SELECT * FROM staff WHERE username = ?', [username]);
            if (rows.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            const user = new User(rows[0]);
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Contraseña incorrecta');
            }
            // Generar el token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return { token };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = AuthService;

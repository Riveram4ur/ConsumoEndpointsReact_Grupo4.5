// services/film.service.js
const db = require('../db');
const Film = require('../models/film.entity');

class FilmService {
    // Obtener todas las películas
    static async getAllFilms() {
        try {
            const [rows] = await db.query('SELECT * FROM film');
            return rows.map(row => new Film(row)); // Convertimos a entidad Film
        } catch (error) {
            throw new Error('Error al obtener las películas');
        }
    }

    // Obtener una película por ID
    static async getFilmById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM film WHERE film_id = ?', [id]);
            if (rows.length === 0) return null;
            return new Film(rows[0]); // Convertimos a entidad Film
        } catch (error) {
            throw new Error('Error al obtener la película');
        }
    }
}

module.exports = FilmService;
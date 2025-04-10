const express = require('express');
const router = express.Router();
const db = require('../db');
const FilmService = require('../services/film.service');
const FilmDTO = require('../dto/film.dto'); //* agregar dto
const authenticateToken = require('../middlewares/auth.middleware'); //middleware

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   - name: Películas
 *     description: Endpoints para gestionar películas
 */

/**
 * @swagger
 * /api/films:
 *   get:
 *     summary: Obtiene la lista de películas (requiere autenticación)
 *     tags: [Películas]
 *     description: Retorna una lista de todas las películas disponibles en la base de datos.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de películas obtenida con éxito
 *       401:
 *         description: Acceso no autorizado, token inválido o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authenticateToken, async(req, res) =>{ // GET asincrona listar las peliculas
    try {
        const films = await FilmService.getAllFilms(); //Llamamos al Services
        
        // Convertimos a DTO antes de enviar al cliente 
        const filmDTOs = films.map(film => new FilmDTO(film));
        res.json(filmDTOs);
    } catch (error) {
        res.status(500).json({error: error.message }); //error 500
    }
});

/**
 * @swagger
 * /api/films/{id}:
 *   get:
 *     summary: Obtiene una película por ID (requiere autenticación)
 *     tags: [Películas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película a obtener
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Película obtenida con éxito
 *       401:
 *         description: Acceso no autorizado, token inválido o no proporcionado
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', authenticateToken, async(req, res) =>{ // GET asincrona con ID cargar pelicula por ID
    try {
        const film = await FilmService.getFilmById(req.params.id);
        if(!film)
            return res.status(404).json({error:'Pelicula no encontrada'});
       
        // Convertimos a DTO antes de enviar
        const filmDTO = new FilmDTO(film);
        res.json(filmDTO);
    } catch (error) {
        res.status(500).json({error: error.message }); //error 500
    }
});

module.exports = router;

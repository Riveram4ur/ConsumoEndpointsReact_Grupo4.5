const request = require('supertest');
const app = require('../server'); // Asegúrate de que server.js exporte la app
const db = require('../db');
const FilmService = require('../services/film.service');
const FilmDTO = require('../dto/film.dto');

jest.mock('../db');
jest.mock('../services/film.service');
jest.mock('../dto/film.dto');

describe('Film Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/films', () => {
        it('debería listar todas las películas con DTO aplicado', async () => {
            const mockFilms = [
                { id: 1, title: 'Film 1', description: 'Descripción 1' },
                { id: 2, title: 'Film 2', description: 'Descripción 2' },
            ];
            const mockFilmDTOs = [
                { id: 1, title: 'Film 1', description: 'Descripción 1' },
                { id: 2, title: 'Film 2', description: 'Descripción 2' },
            ];
            FilmService.getAllFilms.mockResolvedValue(mockFilms);
            FilmDTO.mockImplementation((film) => film);

            const response = await request(app).get('/api/films').set('Authorization', 'Bearer mockToken');
            expect(response.status).toBe(200);
            expect(FilmService.getAllFilms).toHaveBeenCalled();
            expect(response.body).toEqual(mockFilmDTOs);
        });

        it('debería manejar errores en el servidor', async () => {
            FilmService.getAllFilms.mockRejectedValue(new Error('Database error'));
            const response = await request(app).get('/api/films').set('Authorization', 'Bearer mockToken');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /api/films/:id', () => {
        it('debería devolver una película específica con DTO aplicado', async () => {
            const mockFilm = { id: 1, title: 'Film 1', description: 'Descripción 1' };
            const mockFilmDTO = { id: 1, title: 'Film 1', description: 'Descripción 1' };
            FilmService.getFilmById.mockResolvedValue(mockFilm);
            FilmDTO.mockImplementation((film) => film);
            const response = await request(app).get('/api/films/1').set('Authorization', 'Bearer mockToken');
            expect(response.status).toBe(200);
            expect(FilmService.getFilmById).toHaveBeenCalledWith('1');
            expect(response.body).toEqual(mockFilmDTO);
        });

        it('debería devolver 404 si la película no se encuentra', async () => {
            FilmService.getFilmById.mockResolvedValue(null);
            const response = await request(app).get('/api/films/999').set('Authorization', 'Bearer mockToken');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Pelicula no encontrada' });
        });

        it('debería manejar errores en el servidor', async () => {
            FilmService.getFilmById.mockRejectedValue(new Error('Database error'));
            const response = await request(app).get('/api/films/1').set('Authorization', 'Bearer mockToken');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });
});
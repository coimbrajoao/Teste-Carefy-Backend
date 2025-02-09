const request = require('supertest');
const app = require('../app');
const createService = require('../services/createService');
const searchService = require('../services/searchService');
const { avaliation } = require('../repositories/movieRepository');
const avaliationService = require('../services/avaliationService');

jest.mock('../services/createService');
jest.mock('../services/searchService');
jest.mock('../services/avaliationService');

describe("Teste do movie controller", () => {
    const user = { username: 'admin', password: 'admin' };
    const authHeader = `Basic ${Buffer.from(`${user.username}:${user.password}`).toString('base64')}`;

    afterEach(() => {
        jest.clearAllMocks();
    });
    /**
     * Teste POST /movies (falha)
     */

    test("Deve retornar 201 se o filme for criado com sucesso", async () => {
        const movie = { id: 1, title: 'Matrix' };
        createService.createMovie.mockResolvedValue(movie);

        const response = await request(app)
            .post('/movies')
            .send(movie)
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(201);
        expect(response.body.movie).toEqual(movie);
    });

    test("Deve retornar 400 se o filme não for enviado", async () => {

        const response = await request(app)
            .post('/movies')
            .send({})
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Titulo é obrigatório');
    });


     /**
     * Teste GET /movies
     */
    test("Deve listar filmes com paginação", async () => {
        searchService.searchMoviesAll.mockResolvedValue([
            { id: 1, title: "Matrix" },
            { id: 2, title: "Inception" },
        ]);

        const response = await request(app)
            .get('/movies?page=1&limit=1')
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(1);
    });
   
    /**
     * Teste GET /movies/:id
     */
    test("Deve buscar um filme por ID", async () => {
        searchService.searchMoviesById.mockResolvedValue({ id: 1, title: "Matrix" });

        const response = await request(app)
            .get('/movies/1')
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("title", "Matrix");
    });

    /**
     * Teste GET /movies/:id (não encontrado)
     */
    test("Deve retornar 404 se o filme não for encontrado", async () => {
        searchService.searchMoviesById.mockResolvedValue(null);

        const response = await request(app)
            .get('/movies/1')
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Filme não encontrado');
    });

    /**
     * Teste GET /movies/:id/history
     */
    test("Deve buscar histórico do filme", async () => {
        searchService.searchMovieHistory.mockResolvedValue([
            { action: "Criado", timestamp: "2024-02-01T12:00:00Z" }
        ]);

        const response = await request(app)
            .get('/movies/1/history')
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]).toHaveProperty("action", "Criado");
    });
});
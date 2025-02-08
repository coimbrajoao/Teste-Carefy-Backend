'use strict';

const { v4: uuidv4 } = require('uuid');
const avaliationService = require('../services/avaliationService');
const { searchMoviesAll, searchMoviesById, searchMovieHistory } = require("../services/searchService");
const createService = require("../services/createService");
const logger = require('../config/logger');
require('dotenv').config();


/**
 * POST: Criar um filme
 */
exports.post = async (req, res, next) => {
    try {
        const { title } = req.body;

        if (!title) {
            logger.warn({ requestId: req.requestId, route: req.originalUrl }, 'Titulo é obrigatório');
            return res.status(400).send({ message: 'Titulo é obrigatório' });
        }

        const user = req.user?.username || 'Anônimo';

        logger.info({ requestId: req.requestId, route: req.originalUrl }, 'Filme criado com sucesso');


        const movie = await createService.createMovie(title, user);
        return res.status(201).send({ message: 'Filme criado com sucesso', movie });


    } catch (error) {

        logger.error({ requestId: req.requestId, error: error.message, route: req.originalUrl }, 'Erro ao criar filme', error.message);
        console.error('Erro ao criar filme', error.message);
        return res.status(500).send({ message: 'Erro ao criar filme' });

    }
};

/**
 * POST: Avaliar um filme
 */
exports.postAvaliation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { avaliation } = req.body;

        if (isNaN(id)) {
            logger.warn({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'ID inválido');
            return res.status(400).send({ message: 'ID inválido' });
        }

        if (!avaliation) {
            logger.warn({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Avaliação é obrigatória');
            return res.status(400).send({ message: 'Avaliação é obrigatória' });
        }

        if (avaliation < 0 || avaliation > 5) {
            logger.warn({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Avaliação deve ser um número entre 0 e 5');
            return res.status(400).send({ message: 'Avaliação deve ser um número entre 0 e 5' });
        }

        const user = req.user?.username || 'Anônimo';

        const movie = await avaliationService.postAvaliation(id, avaliation, user);

        logger.info({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Filme avaliado com sucesso');

        return res.status(201).send({
            message: 'Filme avaliado com sucesso',
            movie
        });

    } catch (error) {

        logger.error({ requestId: req.requestId, error: error.message, route: req.originalUrl, statusCode: res.statusCode }, 'Erro ao avaliar filme', error.message);
        console.error('Erro ao avaliar filme', error.message);
        return res.status(500).send({ message: 'Erro ao avaliar filme' });

    }
};


/**
 * PUT: Atualizar status do filme
 */
exports.put = async (req, res, next) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        if (isNaN(id)) {
            logger.warn({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'ID inválido');
            return res.status(400).send({ message: 'ID inválido' });
        }

        const movie = await searchMoviesById(id);

        if (!movie) {
            logger.warn({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Filme não encontrado');
            return res.status(404).send({ message: 'Filme não encontrado' });
        }

        const validStatus = ['A assistir', 'Assistido', 'Recomendado', 'Não recomendado'];

        if (!validStatus.includes(status)) {
            logger.warn({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Status inválido');
            return res.status(400).send({ message: 'Status inválido' });
        }

        if (movie.status === 'A assistir' || movie.status === 'Assistido') {
            if (status === 'Recomendado' || status === 'Não recomendado') {
                logger.warn({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Filme precisa ser avaliado antes de ser recomendado/não recomendado');
                return res.status(400).send({ message: 'Filme precisa ser avaliado antes de ser recomendado/não recomendado' });
            }
        }

        const user = req.user?.username || 'Anônimo';
        const updatedMovie = await avaliationService.putStatus(id, status, user);

        logger.info({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Status atualizado com sucesso');
        return res.status(200).send({ message: 'Status atualizado com sucesso', updatedMovie });
    } catch (error) {
        console.error('Erro ao atualizar status do filme', error.message);
        return res.status(500).send({ message: 'Erro ao atualizar status do filme' });
    }

};

/**
 * GET: Buscar todos os filmes com paginação
 */
exports.getAll = async (req, res, next) => {

    try {
        const filter = req.query.filter;
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const offset = (page - 1) * limit;

        const movies = await searchMoviesAll(filter);
        const paginatedMovies = movies.slice(offset, offset + limit);

        logger.info({ requestId: req.requestId, route: req.originalUrl, statusCode: res.statusCode }, 'Filmes encontrados');
        return res.status(200).send({
            curretPage: page,
            totalPage: Math.ceil(movies.length / limit),
            totalMovie: movies.length,
            data: paginatedMovies
        })



    } catch (error) {
        logger.error({ requestId: req.requestId, error: error.message, route: req.originalUrl, statusCode: res.statusCode }, 'Erro ao buscar filmes', error.message);
        console.error('Erro ao buscar filmes', error.message);
        res.status(500).send({ message: 'Erro ao buscar filmes' });
    }
};

/**
 * GET: Buscar histórico de um filme
 */
exports.getAllHistory = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const offset = (page - 1) * limit;
        const id = req.params.id;

        if (isNaN(id)) {
            logger.warn({ requestId: req.requestId, id, route: req.originalUrl }, 'ID inválido');
            return res.status(400).send({ message: 'ID inválido' });
        }

        if (req.path.includes('/history')) {

            const history = await searchMovieHistory(id);
            if (!history || history.length === 0) {
                logger.warn({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Histórico não encontrado');
                return res.status(404).send({ message: 'Histórico não encontrado' });
            }

            logger.info({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Histórico encontrado');
            const paginatedHistory = history.slice(offset, offset + limit);
            return res.status(200).send({ curretPage: page, totalPage: Math.ceil(history.length / limit), totalMovie: history.length, data: paginatedHistory });
        }
    } catch (error) {
        logger.error({ requestId: req.requestId, error: error.message, route: req.originalUrl }, 'Erro ao buscar histórico', error.message);
        console.error('Erro ao buscar histórico', error.message);
        return res.status(500).send({ message: 'Erro ao buscar histórico' });
    }
};

/**
 * GET: Buscar filme por ID
 */
exports.getById = async (req, res, next) => {

    try {

        const id = req.params.id;
        
        if (isNaN(id)) {
            logger.warn({ requestId: req.requestId, id, route: req.originalUrl }, 'ID inválido');
            return res.status(400).send({ message: 'ID inválido' });
        }

        const movie = await searchMoviesById(id);
        if (!movie) {
            logger.warn({ requestId: req.requestId, id, route: req.originalUrl }, 'Filme não encontrado');


            return res.status(404).send({ message: 'Filme não encontrado' });
        }

        logger.info({ requestId: req.requestId, id, route: req.originalUrl, statusCode: res.statusCode }, 'Filme encontrado');
        return res.status(200).send(movie);

    } catch (error) {
        logger.error({ requestId: req.requestId, error: error.message, route: req.originalUrl }, 'Erro ao buscar filme', error.message);
        console.error('Erro ao buscar filme', error.message);
        return res.status(500).send({ message: 'Erro ao buscar filme' });
    }
};
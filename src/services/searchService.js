const movieRepository = require('../repositories/movieRepository');
const logRepository = require('../repositories/logRepository');

async function searchMoviesAll(status) {
    return await movieRepository.getAll(status);
}

async function searchMoviesById(id) {
    return await movieRepository.getById(id);
}

async function searchMovieHistory(id) {
    return await movieRepository.getAllHistory(id);
}

async function searchLogs() {
    return await logRepository.getAll();
}

module.exports = { searchMoviesAll, searchMoviesById, searchMovieHistory, searchLogs };

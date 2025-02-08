const movieRepository = require('../repositories/movieRepository');

async function searchMoviesAll() {
    return await movieRepository.getAll();
}

async function searchMoviesById(id) {
    return await movieRepository.getById(id);
}

async function searchMovieHistory(id) {
    return await movieRepository.getAllHistory(id);
}

module.exports = { searchMoviesAll, searchMoviesById, searchMovieHistory };

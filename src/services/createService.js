const movieRepository = require('../repositories/movieRepository');
const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const apiHeaders = {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`
};

async function searhcMovie(title) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${title}`;
      const response = await axios.get(url, { headers: apiHeaders });

    if(!response.data.results || response.data.results.length === 0) {
        return res.status(404).send({ message: 'Filme não encontrado' });
    }

    return response.data.results[0];
}

async function getGenreName(genreId) {
    if(!genreId) {
        return null;
    }

    const urlGenr = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;
    const responseGenr = await axios.get(urlGenr, { headers: apiHeaders });
    const genreName = responseGenr.data.genres.find(g => g.id === genreId).name;

    return genreName;
}

async function createMovie(title, user) {
    const movie = await searhcMovie(title);
    const genre = await getGenreName(movie.genre_ids[0]);

    const newMovie = await movieRepository.create({
        titlemovie: movie.title,
        Synopsis: movie.overview,
        ReleaseYear: movie.release_date,
        Genre: genre
    });
    
    await movieRepository.createHistory(newMovie.id, 'Criado', 'A assistir', user);

    return newMovie;
}

module.exports = { createMovie };
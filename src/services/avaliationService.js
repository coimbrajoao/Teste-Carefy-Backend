const movieRepository = require('../repositories/movieRepository');

async function postAvaliation(id, avaliation, user) {
    if (!avaliation) {
        throw new Error('Avaliação é obrigatória');
    }
    const status = 'Avaliado';
    await movieRepository.avaliation(id, avaliation);
    await movieRepository.createHistory(id, 'Avaliado', String(avaliation), user);
    await movieRepository.update(id, status);
    return { id, avaliation };
}

async function putStatus(id, status, user) {

    await movieRepository.update(id, status);
    await movieRepository.createHistory(id, 'Atualizado', status, user);
    return { id, status };
}

module.exports = {postAvaliation, putStatus};
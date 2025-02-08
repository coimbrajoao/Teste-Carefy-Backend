const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middlewares/loggerMiddleware');

const app = express();
const router = express.Router();

app.use(logger);
const index = require('./routes/index');
const filmes = require('./routes/movies'); // Certifique-se de que este arquivo existe

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/movies', filmes);

module.exports = app;



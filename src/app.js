const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middlewares/loggerMiddleware');
const setupSwagger = require('./config/swagger');

const app = express();
const router = express.Router();

app.use(logger);
setupSwagger(app);
const index = require('./routes/index');
const filmes = require('./routes/movies'); // Certifique-se de que este arquivo existe

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/logs', index);
app.use('/movies', filmes);

module.exports = app;



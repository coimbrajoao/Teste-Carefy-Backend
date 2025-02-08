const {v4: uuidv4} = require('uuid');
const db = require('../../DataBase/dbContext');
const logger = require('../config/logger');

const logMiddleware = async (req, res, next) => {
    const start = Date.now();
    req.requestId = uuidv4();
    const {method, originalUrl} = req;
    
    const originalSend = res.send;
    res.send = function (body) {
        const duration = Date.now() - start;
        const status = res.statusCode;

        const logEntry = {
            id: uuidv4(),
            requestId: req.requestId,
            method,
            url : originalUrl,
            status,
            timeStamp: new Date().toISOString(),
            duration
        };

        logger.info(logEntry);
        try{

          db.run('INSERT INTO logs (id, method, url, status, timeStamp, duration) VALUES (?, ?, ?, ?, ?, ?)',
                [logEntry.id, logEntry.method, logEntry.url, logEntry.status, logEntry.timeStamp, logEntry.duration]
            );
        }catch(err)  {
            logger.error('Erro ao inserir log no banco de dados', err.message);
        }

        return originalSend.call(this, body);
    };

    next();
};

module.exports = logMiddleware;
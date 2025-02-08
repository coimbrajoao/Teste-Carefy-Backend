const pino = require('pino');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logFile = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

const logger = pino({
    level: 'info',
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: { colorize: true }
            },
            {
                target: 'pino/file',
                options: { destination: path.join(logDir, 'app.log') }
            }
        ]
    }
});

module.exports = logger;

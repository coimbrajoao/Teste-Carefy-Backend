const db = require('../../DataBase/dbContext');

class logRepository {
    async getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM logs', (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            })
        })      
    }   

    async create(log) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO logs (id, method, url, status, timeStamp, duration) VALUES (?, ?, ?, ?, ?, ?)',
                [log.id, log.method, log.url, log.status, log.timeStamp, log.duration], function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(log);
                });
        }); 
    }
}

module.exports = new logRepository();
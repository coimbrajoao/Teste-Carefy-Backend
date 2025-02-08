const db = require('../../DataBase/dbContext');

class movieRepository{
     async getAll(status){
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM movies';
            const params = [];
            if (status) {
                query += ' WHERE status = ?';
                params.push(status);
            }


            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            })
        })
    }

     async getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM movies WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                }
               
                resolve(row);
            })
        })
    }

     async getAllHistory(id) {
   
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM history WHERE movie_id = ?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            })
        })
    }

    async create(movie) {
        return new Promise((resolve, reject) => {
            
            db.run('INSERT INTO movies (title, synopsis, release_year, genre) VALUES (?, ?, ?, ?)', [movie.titlemovie, movie.Synopsis, movie.ReleaseYear, movie.Genre], function (err) {
                if (err) {
                    reject(err);
                }
                const id = this.lastID;
                db.get('SELECT * FROM movies WHERE id = ?', [id], (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(row);
                })
            })

        })
    }

    async createHistory(id, acao, status, user) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO history (movie_id, action, details, user) VALUES (?, ?, ?, ?)',
                [id, String(acao), String(status), String(user)],
                function (err) { // 🔹 function normal para acessar `this.lastID`
                    if (err) {
                        return reject(err);
                    }
    
                    resolve({ id: this.lastID }); // 🔹 Captura corretamente o ID inserido
                }
            );
        });
    }
    

    async update(id, status) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE movies SET status = ? WHERE id = ?', [status, id], function (err) {
                if (err) {
                    reject(err);
                }
                resolve({id, status});
            })
        })
    }

    async avaliation(id, avaliation) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE movies SET avaliation = ? WHERE id = ?', [avaliation, id], function (err) {
                if (err) {
                    reject(err);
                }
                resolve({id, avaliation});
            })
        })
    }
}   

module.exports = new movieRepository();
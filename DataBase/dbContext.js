const sqlite3 = require('sqlite3').verbose();
const { time } = require('console');
const { create } = require('domain');
const path = require('path');

// Caminho correto do banco de dados
const dbPath = path.join(__dirname, 'database.sqlite'); 

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        synopsis TEXT,
        release_year TEXT,
        genre TEXT,
        status TEXT DEFAULT 'A assistir',
        avaliation INTEGER DEFAULT 0
    )`
);

db.run(
`CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER,
        action TEXT,
        details TEXT,
        user text,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ( movie_id) REFERENCES movies(id) ON DELETE CASCADE)`
);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        method TEXT,
        url TEXT,
        status INTEGER,
        timestamp TEXT,
        duration INTEGER
    )`);
});

module.exports = db;

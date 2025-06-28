// db.js
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

// Cria (ou abre) banco.db na raiz do projeto
const db = new sqlite3.Database(path.join(__dirname, 'banco.db'));

// Cria a tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS doacoes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT    NOT NULL,
      email      TEXT    NOT NULL,
      conheceu   TEXT    NOT NULL,
      quantia    REAL    NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;

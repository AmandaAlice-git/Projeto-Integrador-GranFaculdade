const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "database.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Conectado ao banco SQLite.');

    db.run(`CREATE TABLE IF NOT EXISTS produto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            descricao TEXT,
            preco REAL,
            codigo_barras TEXT
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS fornecedor (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            cnpj TEXT,
            endereco TEXT,
            contato TEXT
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS produto_fornecedor (
            produto_id INTEGER,
            fornecedor_id INTEGER,
            PRIMARY KEY (produto_id, fornecedor_id),
            FOREIGN KEY (produto_id) REFERENCES produto(id),
            FOREIGN KEY (fornecedor_id) REFERENCES fornecedor(id)
        )`);
  }
});

module.exports = db;

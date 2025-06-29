const express = require('express');
const cors = require('cors');  // Importa o cors
const db = require('./database');

const app = express();

app.use(cors());        // Libera CORS para todas as requisições
app.use(express.json());

// --- Rotas Produto ---

// Listar todos produtos
app.get('/produtos', (req, res) => {
  db.all('SELECT * FROM produto', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Buscar produto por id
app.get('/produtos/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM produto WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json(row);
  });
});

// Criar produto
app.post('/produtos', (req, res) => {
  const { nome, descricao, preco, codigo_barras } = req.body;
  const sql = 'INSERT INTO produto (nome, descricao, preco, codigo_barras) VALUES (?, ?, ?, ?)';
  db.run(sql, [nome, descricao, preco, codigo_barras], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Atualizar produto
app.put('/produtos/:id', (req, res) => {
  const id = req.params.id;
  const { nome, descricao, preco, codigo_barras } = req.body;
  const sql = 'UPDATE produto SET nome = ?, descricao = ?, preco = ?, codigo_barras = ? WHERE id = ?';
  db.run(sql, [nome, descricao, preco, codigo_barras, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json({ updatedID: id });
  });
});

// Deletar produto
app.delete('/produtos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM produto WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json({ deletedID: id });
  });
});

// --- Rotas Fornecedor ---

// Listar todos fornecedores
app.get('/fornecedores', (req, res) => {
  db.all('SELECT * FROM fornecedor', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Buscar fornecedor por id
app.get('/fornecedores/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM fornecedor WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }
    res.json(row);
  });
});

// Criar fornecedor
app.post('/fornecedores', (req, res) => {
  const { nome, cnpj, endereco, contato } = req.body;
  const sql = 'INSERT INTO fornecedor (nome, cnpj, endereco, contato) VALUES (?, ?, ?, ?)';
  db.run(sql, [nome, cnpj, endereco, contato], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Atualizar fornecedor
app.put('/fornecedores/:id', (req, res) => {
  const id = req.params.id;
  const { nome, cnpj, endereco, contato } = req.body;
  const sql = 'UPDATE fornecedor SET nome = ?, cnpj = ?, endereco = ?, contato = ? WHERE id = ?';
  db.run(sql, [nome, cnpj, endereco, contato, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }
    res.json({ updatedID: id });
  });
});

// Deletar fornecedor
app.delete('/fornecedores/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM fornecedor WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }
    res.json({ deletedID: id });
  });
});

// --- Rotas Associação Produto/Fornecedor ---

// Associar produto a fornecedor
app.post('/associacoes', (req, res) => {
  const { produto_id, fornecedor_id } = req.body;
  const sql = 'INSERT INTO produto_fornecedor (produto_id, fornecedor_id) VALUES (?, ?)';
  db.run(sql, [produto_id, fornecedor_id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Associação criada' });
  });
});

// Desassociar produto de fornecedor
app.delete('/associacoes', (req, res) => {
  const { produto_id, fornecedor_id } = req.body;
  const sql = 'DELETE FROM produto_fornecedor WHERE produto_id = ? AND fornecedor_id = ?';
  db.run(sql, [produto_id, fornecedor_id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Associação não encontrada" });
    }
    res.json({ message: 'Associação removida' });
  });
});

// Listar produtos de um fornecedor
app.get('/fornecedores/:id/produtos', (req, res) => {
  const fornecedor_id = req.params.id;
  const sql = `SELECT p.* FROM produto p
               JOIN produto_fornecedor pf ON p.id = pf.produto_id
               WHERE pf.fornecedor_id = ?`;
  db.all(sql, [fornecedor_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Listar fornecedores de um produto
app.get('/produtos/:id/fornecedores', (req, res) => {
  const produto_id = req.params.id;
  const sql = `SELECT f.* FROM fornecedor f
               JOIN produto_fornecedor pf ON f.id = pf.fornecedor_id
               WHERE pf.produto_id = ?`;
  db.all(sql, [produto_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// server.js
const express = require('express');
const path    = require('path');
const db      = require('./db');

const app  = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* --- Rota que grava no banco --- */
app.post('/doacao', (req, res) => {
  const { nome, email, conheceu, quantia } = req.body;
  if (!nome || !email || !conheceu || !quantia) {
    return res.status(400).send('Campos obrigatórios faltando.');
  }

  const stmt = db.prepare(
    `INSERT INTO doacoes (nome, email, conheceu, quantia) VALUES (?, ?, ?, ?)`
  );
  stmt.run(nome, email, conheceu, quantia, function (err) {
    if (err) return res.status(500).send('Erro ao gravar no banco.');
    res.send(`<h1>Obrigado!</h1><p>Registro nº ${this.lastID}</p>`);
  });
  stmt.finalize();
});

/* --- Rota opcional para listar doações --- */
app.get('/doacoes', (_, res) => {
  db.all('SELECT * FROM doacoes ORDER BY created_at DESC', (err, rows) =>
    err ? res.status(500).json(err) : res.json(rows)
  );
});

/*--- rota para deletar doação pelo id --- */
app.delete('/doacoes/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM doacoes WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Doação não encontrada' });
    }
    res.json({ message: `Doação ${id} deletada com sucesso.` });
  });
});


app.listen(PORT, () =>
  console.log(`✔️  Servidor rodando em http://localhost:${PORT}`)
);

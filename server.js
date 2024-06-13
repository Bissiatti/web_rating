const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;


let db = new sqlite3.Database('./elo_ranking.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
  if (err) {
    throw err;
  }
  tables.forEach((table) => {
    console.log(table.name);
  });
});

app.get('/tables', (req, res) => {
  db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {

    tablesNames = tables.map(table => table.name);
    res.send(tablesNames);
  });
});

app.get('/rating', (req, res) => {
  const table = req.query.table;
  db.all(`SELECT * FROM '${table}' WHERE Year = 2024`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
})

var table;

// Rota para puxar todos os dados de uma tabela específica
app.get('/data', (req, res) => {
  table = req.query.table;
  db.all(`SELECT DISTINCT "index" FROM '${table}'`, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

app.get('/query', (req, res) => {
  const data = req.query.data.split(',');
  const placeholders = data.map(() => '?').join(',');
  const sql = `SELECT * FROM '${table}' WHERE "index" IN (${placeholders})`;
  
  db.all(sql, data, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
  });

// cria uma rota '/' que retorna a pasta public

app.use(express.static('public'));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para outra página
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
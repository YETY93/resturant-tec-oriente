const express = require('express');
const app = express();
const db = require('./database');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/tables');
});

app.get('/tables', (req, res) => {
  const tables = db.prepare('SELECT * FROM tables WHERE is_active = 1').all();
  res.render('tables/index', { tables });
});

app.post('/tables', (req, res) => {
  const { number } = req.body;
  try {
    db.prepare('INSERT INTO tables (number) VALUES (?)').run(number);
    res.redirect('/tables');
  } catch (error) {
    res.render('tables/index', { 
      tables: db.prepare('SELECT * FROM tables WHERE is_active = 1').all(),
      error: 'El número de mesa ya existe'
    });
  }
});

app.post('/tables/:id/delete', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE tables SET is_active = 0 WHERE id = ?').run(id);
  res.redirect('/tables');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
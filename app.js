const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const sqlite3 = require('sqlite3').verbose();

// Abrir la conexión a la base de datos
let db = new sqlite3.Database('database.db');

// Crear la tabla "categorias" con las columnas "id" y "categoria"
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS categorias (id INTEGER PRIMARY KEY AUTOINCREMENT, categoria TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT, producto TEXT, categoria_id INTEGER, existencia_actual INTEGER, precio DECIMAL)");
});

// Cerrar la conexión a la base de datos
//db.close();

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));// Middleware para analizar los datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));


app.set('views', './views');
app.set('view engine', 'html');

// Ruta para la vista de dashboard
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/dashboard.html');
});

// Ruta para la vista de productos
app.get('/productos', (req, res) => {
    res.sendFile(__dirname + '/views/productos.html');
});

// Ruta para la vista de categorias
app.get('/categorias', (req, res) => {
    res.sendFile(__dirname + '/views/categorias.html');
});

// Ruta para la vista de compras
app.get('/compras', (req, res) => {
    res.sendFile(__dirname + '/views/compras.html');
});

// Ruta para la vista de favoritos
app.get('/favoritos', (req, res) => {
    res.sendFile(__dirname + '/views/favoritos.html');
});

/**Rutas CRUD */
/** CATEGORIAS*/
// Ruta para obtener todos los registros
app.get('/categorias-api', (req, res) => {
  db.all('SELECT * FROM categorias', (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(rows);
  });
});

// Ruta para obtener un registro por ID
app.get('/categorias-api/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM categorias WHERE id = ?', [id], (err, row) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(row);
  });
});

// Ruta para crear un nuevo registro
app.post('/categorias-api', (req, res) => {
  
  const { categoria } = req.body;
  db.run('INSERT INTO categorias (categoria) VALUES (?)', [categoria], function(err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ id: this.lastID });
  });
});

// Ruta para actualizar un registro por ID
app.put('/categorias-api/:id', (req, res) => {
  const id = req.params.id;
  const { categoria } = req.body;
  db.run('UPDATE categorias SET categoria = ? WHERE id = ?', [categoria, id], function(err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ changes: this.changes });
  });
});

// Ruta para eliminar un registro por ID
app.delete('/categorias-api/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM categorias WHERE id = ?', [id], function(err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ changes: this.changes });
  });
});

/**PRODUCTOS */
// Ruta para obtener todos los registros
app.get('/productos-api', (req, res) => {
  db.all('SELECT productos.*, categorias.categoria FROM productos join categorias on categorias.id = productos.categoria_id', (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(rows);
  });
});

// Ruta para obtener un registro por ID
app.get('/productos-api/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM productos WHERE id = ?', [id], (err, row) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(row);
  });
});

// Ruta para crear un nuevo registro
app.post('/productos-api', (req, res) => {
  const { codigo, producto, categoria_id, existencia_actual, precio } = req.body;
  db.run('INSERT INTO productos (codigo, producto, categoria_id, existencia_actual, precio) VALUES (?, ?, ?, ?, ?)', [codigo, producto, categoria_id, existencia_actual, precio], function(err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ id: this.lastID });
  });
});

// Ruta para actualizar un registro por ID
app.put('/productos-api/:id', (req, res) => {
  const id = req.params.id;
  const { codigo, producto, existencia_actual, precio } = req.body;
  db.run('UPDATE productos SET codigo = ?, producto = ?, existencia_actual = ?, precio = ? WHERE id = ?', [codigo, producto, existencia_actual, precio, id], function(err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ changes: this.changes });
  });
});

// Ruta para eliminar un registro por ID
app.delete('/productos-api/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM productos WHERE id = ?', [id], function(err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ changes: this.changes });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
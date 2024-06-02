const express = require('express');
const app = express();
const port = 3000;

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
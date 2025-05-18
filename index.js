require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mostrarImagen = require('./mostrar_imagen.js');
const mostrarEspecie = require('./mostrar_especie.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api', mostrarImagen);
app.use('/api', mostrarEspecie);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

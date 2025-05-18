const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const mostrarEspecie = require('./mostrar_especie');
const mostrarImagen = require('./mostrar_imagen');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', mostrarEspecie);
app.use('/api', mostrarImagen);

module.exports = app;
module.exports.handler = serverless(app); // 👈 necesario para Vercel

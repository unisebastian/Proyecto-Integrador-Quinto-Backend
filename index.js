require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// // ✅ Agrega CORS antes que cualquier middleware o rutas
// app.use(cors({
//   origin: 'https://proyecto-integrador-quinto-frontend-ten.vercel.app', // tu frontend en Vercel
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// Middleware para interpretar JSON
app.use(express.json());

// Importar rutas
const mostrarImagenRoutes = require('./mostrar_imagen.js');
const mostrarEspecieRoutes = require('./mostrar_especie.js');

// Montar las rutas
app.use('/api/', mostrarImagenRoutes);
app.use('/api/', mostrarEspecieRoutes);

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

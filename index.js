require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// 🔐 Orígenes permitidos
const allowedOrigins = [
  'http://localhost:4200', // Desarrollo local
  'https://proyecto-integrador-quinto-frontend-ten.vercel.app' // Producción en Vercel
];

// 🛡️ Middleware de CORS configurado
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 🧩 Middleware para interpretar JSON
app.use(express.json());

// 📦 Importar rutas
const mostrarImagenRoutes = require('./mostrar_imagen.js');
const mostrarEspecieRoutes = require('./mostrar_especie.js');
const mostrarConglomeradoRoutes = require('./conglomerado.js');
const brigadistasRoutes = require('./gestion-brigadistas.js');
const conglomeradoRoutes = require('./gestion-conglomerado.js');
const municipiosRoutes = require('./municipios.js');
const conglomeradoSubparcelasRoutes = require('./gestion_arboles.js');
const especieRoutes = require('./especie.js');
const laboratorioRoutes = require('./laboratorio.js');
const agregarEspecieRoutes = require('./agregar_especie.js');
const reporteRoutes = require('./reportes.js');
const analisis_laboratorioRoutes = require('./analisis_laboratorio.js');
const brigadaRoutes = require('./brigada.js');

// 🔀 Montar rutas con prefijo '/api'
app.use('/api/', mostrarImagenRoutes);
app.use('/api/', mostrarEspecieRoutes);
app.use('/api/', mostrarConglomeradoRoutes);
app.use('/api/', brigadistasRoutes);
app.use('/api/', conglomeradoRoutes);
app.use('/api/', municipiosRoutes);
app.use('/api/', conglomeradoSubparcelasRoutes);
app.use('/api/', especieRoutes);
app.use('/api/', laboratorioRoutes);
app.use('/api/', agregarEspecieRoutes);
app.use('/api/', reporteRoutes);
app.use('/api/', analisis_laboratorioRoutes);
app.use('/api/', brigadaRoutes);


// 🚀 Levantar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

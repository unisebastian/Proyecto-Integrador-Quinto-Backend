require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Importar rutas con nombres diferentes
const mostrarImagenRoutes = require('./mostrar_imagen.js');
const mostrarEspecieRoutes = require('./mostrar_especie.js');

// Montar las rutas con prefijos diferentes o el mismo
app.use('/api/', mostrarImagenRoutes); // Ejemplo: rutas de imagen estarán en /api/imagen/...
app.use('/api/', mostrarEspecieRoutes);     // Rutas de usuarios en /api/usuarios/...

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

const express = require('express');
const router = express.Router();
const pool = require('./conexion.js'); // Tu conexión a PostgreSQL

// Ruta actualizada para obtener conglomerados con coordenadas como array y fecha formateada
router.get('/mostrar_conglomerado', async (req, res) => {
  try {
    const query = `
      SELECT 
        identificador,
        TO_CHAR(fecha_creacion, 'YYYY-MM-DD') AS fecha_creacion,
        string_to_array(coordenadas, ',')::float8[] AS coordenadas
      FROM conglomerado
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

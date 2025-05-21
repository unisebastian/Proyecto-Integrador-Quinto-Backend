const express = require('express');
const router = express.Router();
const pool = require('./conexion.js'); // Tu conexión a PostgreSQL

// Ruta actualizada para obtener especies con región agregada
router.get('/mostrar_conglomerado', async (req, res) => {
  try {
    const query = `
      SELECT identificador AS identificador, fecha_creacion AS fecha_creacion, ARRAY[coordenadas] AS coordenadas, FROM conglomerado
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('./conexion.js'); // Tu conexión a PostgreSQL

// Ruta para obtener especies
router.get('/especies', async (req, res) => {
  try {
    const query = `
      SELECT 
        e.nombre_comun AS nombre_comun, 
        e.nombre_cientifico AS nombre_cientifico,
        e.familia AS familia,
        e.uso AS uso,
        STRING_AGG(DISTINCT r.nombre, ', ' ORDER BY r.nombre) AS region
      FROM especie e
      JOIN arbol a ON a.id_especie = e.id_especie
      JOIN subparcela s ON s.id_subparcela = a.id_subparcela
      JOIN conglomerado c ON c.id_conglomerado = s.id_conglomerado
      JOIN region r ON r.id_region = c.id_region
      GROUP BY e.nombre_comun, e.nombre_cientifico, e.familia, e.uso
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('./conexion.js'); // Tu conexión a PostgreSQL

router.get('/mostrar_especie', async (req, res) => {
  try {
    const query = `
      SELECT 
        e.nombre_comun AS nombre_comun, 
        e.nombre_cientifico AS nombre_cientifico,
        e.familia AS familia,
        e.uso AS uso,
        COALESCE(
          ARRAY_AGG(DISTINCT r.nombre ORDER BY r.nombre) FILTER (WHERE r.nombre IS NOT NULL),
          ARRAY['Sin región']
        ) AS region
      FROM especie e
      LEFT JOIN arbol a ON a.id_especie = e.id_especie
      LEFT JOIN subparcela s ON s.id_subparcela = a.id_subparcela
      LEFT JOIN conglomerado c ON c.id_conglomerado = s.id_conglomerado
      LEFT JOIN region r ON r.id_region = c.id_region
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

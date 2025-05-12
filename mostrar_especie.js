const express = require('express');
const connection = require('./conexion');
const router = express.Router();

// GET /mostrar_especie
router.get('/mostrar_especie', (req, res) => {
  const sql = `
    SELECT 
      e.nombre_comun AS nombre_comun,
      e.nombre_cientifico AS nombre_cientifico,
      e.familia AS familia,
      e.uso AS uso,
      r.nombre AS region
    FROM especie e 
    JOIN especie_subparcela es ON e.id_especie = es.id_especie
    JOIN subparcela s ON s.id_subparcela = es.id_subparcela
    JOIN conglomerado c ON c.id_conglomerado = s.id_conglomerado
    JOIN region r ON r.id_region = c.id_region
  `;

  connection.query(sql, (err, results) => {
  if (err) {
    console.error('Error de consulta:', err);  // Esto te dará más detalles sobre el error
    return res.status(500).json({ error: err.message });  // Esto mostrará el error real
  }

  res.json(results);
  });
});


module.exports = router;

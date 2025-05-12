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
    FROM especie_subparcela es
    JOIN especie e ON es.id_especie = e.id_especie
    JOIN subparcela s ON es.id_subparcela = s.id_subparcela
    JOIN conglomerado c ON s.id_conglomerado = c.id_conglomerado
    JOIN region r ON c.id_region = r.id_region
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las especies' });
    }

    res.json(results);
  });
});


module.exports = router;

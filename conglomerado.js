const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');

router.get('/mostrar_conglomerado', async (req, res) => {
  try {
    const query = `
  SELECT 
    c.identificador,
    TO_CHAR(c.fecha_creacion, 'YYYY-MM-DD') AS fecha_creacion,
    r.nombre AS region,
    m.nombre AS municipio,
    string_to_array(c.coordenadas, ',')::float8[] AS coordenadas,
    STRING_AGG(DISTINCT e.nombre_comun, ', ' ORDER BY e.nombre_comun) AS especies
  FROM conglomerado c
  JOIN region r ON r.id_region = c.id_region
  JOIN municipio m ON m.id_municipio = c.id_municipio
  LEFT JOIN subparcela s ON s.id_conglomerado = c.id_conglomerado
  LEFT JOIN arbol a ON a.id_subparcela = s.id_subparcela
  LEFT JOIN especie e ON a.id_especie = e.id_especie
  GROUP BY 
    c.identificador,
    c.fecha_creacion,
    r.nombre,
    m.nombre,
    c.coordenadas
`;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

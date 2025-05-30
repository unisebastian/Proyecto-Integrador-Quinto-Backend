const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');

router.get('/mostrar_municipios', async (req, res) => {
  try {
    const query = `
      SELECT commentMore actions
        m.id_municipio,
        m.nombre AS nombre_municipio,
        d.nombre AS nombre_departamento
      FROM municipio m
      INNER JOIN departamento d ON m.id_departamento = d.id_departamento
      WHERE m.nombre IS NOT NULL AND d.nombre IS NOT NULL
      ORDER BY m.nombre;
    `;

    const { rows } = await pool.query(query);

    const municipios = rows.map(row => ({
      id: row.id_municipio,
      nombre: row.nombre_municipio,
      departamento: row.nombre_departamento
    }));

    res.json(municipios);
  } catch (err) {
    console.error('Error al consultar municipios:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

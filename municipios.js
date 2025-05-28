const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');

router.get('/mostrar_municipios', async (req, res) => {
  try {
    const query = `
      SELECT
        m.nombre || ', ' || d.nombre AS municipio_completo
      FROM municipio m
      INNER JOIN departamento d ON m.id_departamento = d.id_departamento
      WHERE m.nombre IS NOT NULL AND d.nombre IS NOT NULL
      ORDER BY m.nombre;
    `;

    const { rows } = await pool.query(query);

    // Mapear para devolver solo el array plano de strings
    const municipiosPlanos = rows.map(row => row.municipio_completo);

    res.json(municipiosPlanos);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

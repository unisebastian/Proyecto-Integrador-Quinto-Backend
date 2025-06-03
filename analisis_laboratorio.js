const express = require('express');
const router = express.Router();
const pool = require('./conexion.js'); // conexión a PostgreSQL

// Ruta POST para insertar un nuevo análisis de laboratorio
router.post('/analisis_laboratorio', async (req, res) => {
  const {
    identificador,
    id_muestra,
    clasificacion_taxonomica,
    resultados,
    metodo_de_analisis,
    fecha_modificacion
  } = req.body;

  const query = `
    INSERT INTO analisis_laboratorio (
      identificador,
      id_muestra,
      clasificacion_taxonomica,
      resultados,
      metodo_de_analisis,
      fecha_modificacion
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    identificador,
    id_muestra,
    clasificacion_taxonomica,
    resultados,
    metodo_de_analisis,
    fecha_modificacion
  ];

  try {
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error al insertar análisis de laboratorio:', err);
    res.status(500).send('Error al insertar en la base de datos');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');


// ✅ GET - Listar todos
router.get('/gestion-conglomerado', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conglomerado ORDER BY id_conglomerado ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST - Crear nuevo conglomerado con nombres de región y municipio
router.post('/gestion-conglomerado', async (req, res) => {
  const {
    identificador,
    fecha_establecimiento,
    fecha_creacion,
    nombre_region,
    nombre_municipio,
    coordenadas
  } = req.body;

  try {
    // Buscar id_region por nombre
    const regionResult = await pool.query(
      'SELECT id_region FROM region WHERE nombre = $1',
      [nombre_region]
    );
    if (regionResult.rows.length === 0) {
      return res.status(400).json({ error: 'Región no encontrada' });
    }
    const id_region = regionResult.rows[0].id_region;

    // Buscar id_municipio por nombre
    const municipioResult = await pool.query(
      'SELECT id_municipio FROM municipio WHERE nombre = $1',
      [nombre_municipio]
    );
    if (municipioResult.rows.length === 0) {
      return res.status(400).json({ error: 'Municipio no encontrado' });
    }
    const id_municipio = municipioResult.rows[0].id_municipio;

    // Insertar el conglomerado
    const insertResult = await pool.query(
      `INSERT INTO conglomerado 
        (identificador, fecha_establecimiento, fecha_creacion, id_region, id_municipio, coordenadas) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [identificador, fecha_establecimiento, fecha_creacion, id_region, id_municipio, coordenadas]
    );

    res.status(201).json(insertResult.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ PUT - Editar conglomerado
router.put('/gestion-conglomerado/:id', async (req, res) => {
  const { id } = req.params;
  const { identificador, fecha_establecimiento, fecha_creacion, id_region, id_municipio, coordenadas} = req.body;
  try {
    const result = await pool.query(
      `UPDATE conglomerado 
       SET identificador=$1, fecha_establecimiento=$2, fecha_creacion=$3, id_region=$4, id_municipio=$5, coordenadas=$6
       WHERE id_conglomerado=$7 RETURNING *`,
      [ identificador, fecha_establecimiento, fecha_creacion, id_region, id_municipio, coordenadas, id ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE - Eliminar conglomerado
router.delete('/gestion-conglomerado/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM brigadistas_ideam WHERE id_conglomerado = $1', [id]);
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Obtener por ID (para editar)
router.get('/gestion-conglomerado/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM conglomerado WHERE id_conglomerado = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;

// routes/brigadistas.js
const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');


// ✅ GET - Listar todos
router.get('/brigadistas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM brigadistas_ideam ORDER BY id_usuario ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST - Crear nuevo
router.post('/brigadistas', async (req, res) => {
  const { nombre, correo, direccion, telefono, rol } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO brigadistas_ideam (nombre, correo, direccion, telefono, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, correo, direccion, telefono, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT - Editar brigadista
router.put('/brigadistas/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, direccion, telefono, rol } = req.body;
  try {
    const result = await pool.query(
      `UPDATE brigadistas_ideam 
       SET nombre=$1, correo=$2, direccion=$3, telefono=$4, rol=$5 
       WHERE id_usuario=$6 RETURNING *`,
      [nombre, correo, direccion, telefono, rol, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE - Eliminar brigadista
router.delete('/brigadistas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM brigadistas_ideam WHERE id_usuario = $1', [id]);
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Obtener por ID (para editar)
router.get('/brigadistas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM brigadistas_ideam WHERE id_usuario = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;

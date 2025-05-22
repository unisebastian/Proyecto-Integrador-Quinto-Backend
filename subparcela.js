// backend/routes/subparcela.js
const express = require('express');
const router = express.Router();
const pool = require('../config/conexion');

// Obtener subparcelas dentro de un conglomerado
router.get('/subparcelas/:id_conglomerado', async (req, res) => {
  const { id_conglomerado } = req.params;

  try {
    const result = await pool.query(`
      SELECT id_subparcela, numero, coordenadas
      FROM subparcela
      WHERE id_conglomerado = $1
    `, [id_conglomerado]);

    res.json(result.rows); // Devolver las subparcelas de ese conglomerado
  } catch (err) {
    console.error('Error al obtener subparcelas:', err);
    res.status(500).send('Error en la base de datos');
  }
});

module.exports = router;

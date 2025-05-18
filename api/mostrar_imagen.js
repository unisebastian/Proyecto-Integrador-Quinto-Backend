const express = require('express');
const pool = require('.BD/conexion.js'); // tu pool de PostgreSQL
const router = express.Router();

// GET /imagen_especie/:nombre_comun
router.get('/imagen_especie/:nombre_comun', async (req, res) => {
  const nombre_comun = req.params.nombre_comun;
  const sql = 'SELECT imagen_especie FROM imagen_especie WHERE nombre = $1';

  try {
    const { rows } = await pool.query(sql, [nombre_comun]);
    if (rows.length === 0) {
      return res.status(404).send('Imagen no encontrada');
    }

    const imagenBuffer = rows[0].imagen_especie;
    res.set('Content-Type', 'image/webp'); // Cambia al tipo correcto de la imagen si es necesario
    res.send(imagenBuffer);
  } catch (err) {
    console.error('Error al obtener imagen:', err);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;

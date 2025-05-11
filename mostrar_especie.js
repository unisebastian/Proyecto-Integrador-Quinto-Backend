const express = require('express');
const connection = require('./conexion');
const router = express.Router();

// GET /mostrar_especie
router.get('/mostrar_especie', (req, res) => {
  const sql = 'SELECT nombre_comun, nombre_cientifico, familia, uso FROM especie';

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las especies' });
    }

    res.json(results); // Enviamos todos los datos obtenidos como JSON
  });
});

module.exports = router;

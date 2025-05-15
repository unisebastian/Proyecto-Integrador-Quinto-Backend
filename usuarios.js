const express = require('express');
const router = express.Router();
const connection = require('./BD/conexion');

router.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM brigadistas_ideam', (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta SQL:', err); // ⬅️ agrega esto
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

module.exports = router;

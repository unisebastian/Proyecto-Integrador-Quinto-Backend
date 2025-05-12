const express = require('express');
const connection = require('./conexion');
const router = express.Router();

// GET /imagen_arbol/:id
router.get('/imagen_especie/:nombre_comun', (req, res) => {
  const nombre_comun = req.params.nombre_comun;
  const sql = 'SELECT imagen_arbol FROM imagen_especie WHERE nombre = ?';

  connection.query(sql, [nombre_comun], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send('Imagen no encontrada');
    }

    const imagenBuffer = results[0].imagen_arbol;
    res.set('Content-Type', 'image/jpg'); // Ajusta según el tipo real de la imagen
    res.send(imagenBuffer);
  });
});

module.exports = router;

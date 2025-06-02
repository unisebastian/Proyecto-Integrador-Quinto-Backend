const express = require('express');
const router = express.Router();
const pool = require('./conexion.js'); // Tu conexión a PostgreSQL

// const sql = 'INSERT INTO especie (nombre_comun, nombre_cientifico, familia, uso) VALUES (?, ?, ?, ?)';
// const valores = ['Roble', 'Quercus robur', 'Fagaceae', 'Madera utilizada para la construcción, ebanistería y fabricación de barriles'];

// connection.query(sql, valores, (err, result) => {
//   if (err) {
//     console.error('❌ Error al insertar especie:', err);
//     return;
//   }
//   console.log('✅ especie insertado con ID:', result.insertId);
//   connection.end(); // Cierra la conexión al terminar
// });



router.get('/especie', async (req, res) => {
  try {
    const query = `
      SELECT id_especie AS id_especie,
      nombre_comun AS nombre_comun
      FROM especie
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
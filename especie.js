const connection = require('./connection/conexion.js'); // Usa tu archivo de conexión

const sql = 'INSERT INTO especie (nombre_comun, nombre_cientifico, familia, uso) VALUES (?, ?, ?, ?)';
const valores = ['Roble', 'Quercus robur', 'Fagaceae', 'Madera utilizada para la construcción, ebanistería y fabricación de barriles'];

connection.query(sql, valores, (err, result) => {
  if (err) {
    console.error('❌ Error al insertar especie:', err);
    return;
  }
  console.log('✅ especie insertado con ID:', result.insertId);
  connection.end(); // Cierra la conexión al terminar
});

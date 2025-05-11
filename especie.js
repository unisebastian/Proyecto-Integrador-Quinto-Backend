const connection = require('./conexion'); // Usa tu archivo de conexión

const sql = 'INSERT INTO especie (nombre_comun, nombre_cientifico, familia, uso) VALUES (?, ?, ?, ?)';
const valores = ['Gualanday', 'Tocoyena formosa', 'Rubiaceae', 'Ornamental, sombra'];

connection.query(sql, valores, (err, result) => {
  if (err) {
    console.error('❌ Error al insertar especie:', err);
    return;
  }
  console.log('✅ especie insertado con ID:', result.insertId);
  connection.end(); // Cierra la conexión al terminar
});

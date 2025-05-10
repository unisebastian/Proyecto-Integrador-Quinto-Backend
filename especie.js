const connection = require('./conexion'); // Usa tu archivo de conexión

const sql = 'INSERT INTO especie (nombre_comun, nombre_cientifico, familia, uso) VALUES (?, ?, ?, ?)';
const valores = ['Guayacán', 'Tabebuia chrysantha', 'Zygophyllaceae/Bignoniaceae', 'construcción, carpintería, muebles, ornamentación y reforestación'];

connection.query(sql, valores, (err, result) => {
  if (err) {
    console.error('❌ Error al insertar brigadistas_ideam:', err);
    return;
  }
  console.log('✅ Brigadista insertado con ID:', result.insertId);
  connection.end(); // Cierra la conexión al terminar
});

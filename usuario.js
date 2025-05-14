const connection = require('./connection/conexion.js'); // Usa tu archivo de conexión

const sql = 'INSERT INTO brigadistas_ideam (nombre, correo, direccion, telefono, rol) VALUES (?, ?, ?, ?, ?)';
const valores = ['Angel Avendaño', 'angel@example.com', 'Calle 55 # 34', '31245789003', 'investigador'];

connection.query(sql, valores, (err, result) => {
  if (err) {
    console.error('❌ Error al insertar brigadistas_ideam:', err);
    return;
  }
  console.log('✅ Brigadista insertado con ID:', result.insertId);
  connection.end(); // Cierra la conexión al terminar
});

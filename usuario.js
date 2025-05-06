const connection = require('./conexion'); // Usa tu archivo de conexión

const sql = 'INSERT INTO usuario (nombre, correo, direccion, telefono, rol) VALUES (?, ?, ?, ?, ?)';
const valores = ['Angel Avendaño', 'angel@example.com', 'Calle 55 # 34', '31245789023', 'investigador'];

connection.query(sql, valores, (err, result) => {
  if (err) {
    console.error('❌ Error al insertar usuario:', err);
    return;
  }
  console.log('✅ Usuario insertado con ID:', result.insertId);
  connection.end(); // Cierra la conexión al terminar
});

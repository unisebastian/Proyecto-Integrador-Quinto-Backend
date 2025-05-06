const fs = require('fs');
const path = require('path');
const connection = require('./conexion');

// Ruta de la imagen
const rutaImagen = path.join(__dirname, 'arbol-cedro-libano.jpg');

// Leer la imagen como buffer
const imagenBuffer = fs.readFileSync(rutaImagen);

// Datos para insertar
const nombre = 'Cedro2';
const sql = 'INSERT INTO imagen_arbol (nombre, imagen_arbol) VALUES (?, ?)';
const valores = [nombre, imagenBuffer];

connection.query(sql, valores, (err, result) => {
  if (err) {
    console.error('❌ Error al insertar:', err);
  } else {
    console.log('✅ Insertado con ID:', result.insertId);
  }
  connection.end();
});

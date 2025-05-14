const fs = require('fs');
const path = require('path');
const connection = require('./BD/conexion.js');

// Ruta de la imagen
const rutaImagen = path.join(__dirname, 'arbol-roble-768x512.webp');
const imagenBuffer = fs.readFileSync(rutaImagen);
const nombreEspecie = 'Roble';

// 1. Buscar id_especie
const buscarIdSql = 'SELECT id_especie FROM especie WHERE nombre_comun = ?';

connection.query(buscarIdSql, [nombreEspecie], (err, results) => {
  if (err) {
    console.error('❌ Error al buscar id_especie:', err);
    connection.end();
    return;
  }

  if (results.length === 0) {
    console.error('⚠️ No se encontró la especie:', nombreEspecie);
    connection.end();
    return;
  }

  const idEspecie = results[0].id_especie;

  // 2. Insertar en imagen_especie
  const insertarSql = 'INSERT INTO imagen_especie (id_especie, nombre, imagen_arbol) VALUES (?, ?, ?)';
  const valores = [idEspecie, nombreEspecie, imagenBuffer];

  connection.query(insertarSql, valores, (err, result) => {
    if (err) {
      console.error('❌ Error al insertar:', err);
    } else {
      console.log('✅ Insertado con ID:', result.insertId);
    }
    connection.end();
  });
});

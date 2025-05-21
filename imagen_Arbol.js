const fs = require('fs');
const path = require('path');
const pool = require('./conexion.js'); // Pool de pg

const rutaImagen = path.join(__dirname, 'arbol-roble-768x512.webp');
const imagenBuffer = fs.readFileSync(rutaImagen);
const nombreEspecie = 'Roble';

(async () => {
  try {
    // 1. Buscar id_especie
    const buscarIdSql = 'SELECT id_especie FROM especie WHERE nombre_comun = $1';
    const { rows } = await pool.query(buscarIdSql, [nombreEspecie]);

    if (rows.length === 0) {
      console.error('⚠️ No se encontró la especie:', nombreEspecie);
      return;
    }

    const idEspecie = rows[0].id_especie;

    // 2. Insertar en imagen_especie
    const insertarSql = `
      INSERT INTO imagen_especie (id_especie, nombre, imagen_especie)
      VALUES ($1, $2, $3)
      RETURNING id_imagen_especie
    `;
    const valores = [idEspecie, nombreEspecie, imagenBuffer];

    const resultadoInsert = await pool.query(insertarSql, valores);
    console.log('✅ Insertado con ID:', resultadoInsert.rows[0].id_imagen_especie);

  } catch (err) {
    console.error('❌ Error en la operación:', err);
  } finally {
    // Opcional cerrar pool si tu app termina aquí
    // await pool.end();
  }
})();

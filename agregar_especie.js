const express = require('express');
const multer = require('multer');
const router = express.Router();
const pool = require('./conexion.js');

const upload = multer(); // Para recibir la imagen en memoria

router.post('/especie-completa', upload.single('imagen'), async (req, res) => {
  const { nombre_comun, nombre_cientifico, familia, uso } = req.body;
  const imagen = req.file?.buffer;

  if (!nombre_comun || !nombre_cientifico || !familia || !uso || !imagen) {
    return res.status(400).json({ error: 'Todos los campos y la imagen son requeridos' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insertar en especie
    const insertEspecie = `
      INSERT INTO especie (nombre_comun, nombre_cientifico, familia, uso)
      VALUES ($1, $2, $3, $4)
      RETURNING id_especie
    `;
    const especieResult = await client.query(insertEspecie, [
      nombre_comun,
      nombre_cientifico,
      familia,
      uso
    ]);

    const id_especie = especieResult.rows[0].id_especie;

    // Insertar imagen usando nombre_comun como nombre
    const insertImagen = `
      INSERT INTO imagen_especie (id_especie, nombre, imagen_especie)
      VALUES ($1, $2, $3)
    `;
    await client.query(insertImagen, [id_especie, nombre_comun, imagen]);

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Especie e imagen agregadas correctamente',
      id_especie
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al agregar especie e imagen:', error);
    res.status(500).json({ error: 'Error al registrar especie e imagen' });
  } finally {
    client.release();
  }
});

module.exports = router;

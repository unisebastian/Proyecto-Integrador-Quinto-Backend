const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');
const multer = require('multer');

// Configurar multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/conglomerado_subparcela', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id_conglomerado,
        c.identificador,
        s.id_subparcela,
        s.numero AS numero_subparcela
      FROM conglomerado c
      JOIN subparcela s ON s.id_conglomerado = c.id_conglomerado;
    `;

    const result = await pool.query(query);

    // Agrupar subparcelas por conglomerado
    const conglomeradoMap = new Map();

    result.rows.forEach(row => {
      const id = row.id_conglomerado;

      if (!conglomeradoMap.has(id)) {
        conglomeradoMap.set(id, {
          id_conglomerado: id,
          identificador: row.identificador,
          subparcelas: []
        });
      }

      conglomeradoMap.get(id).subparcelas.push({
        id_subparcela: row.id_subparcela,
        numero_subparcela: row.numero_subparcela
      });
    });

    const conglomerados = Array.from(conglomeradoMap.values());

    res.json(conglomerados);

  } catch (err) {
    console.error('ERROR EN API:', err);
    res.status(500).json({ error: err.message });
  }
});


// Ruta para registrar árbol, muestra y opcionalmente imagen
router.post('/gestion_arbol', upload.single('imagen'), async (req, res) => {
  const {
    id_subparcela,
    id_especie,
    altura_mt,
    diametro_cm,
    observaciones,
    coordenadas,
    identificador,
    tipo,
    fecha_recoleccion
  } = req.body;

  const imagenBuffer = req.file ? req.file.buffer : null;
  const id_especie_val = (id_especie === undefined || id_especie === null || id_especie === '') 
    ? null 
    : parseInt(id_especie, 10);

  try {
    const resultArbol = await pool.query(
      `INSERT INTO arbol 
        (id_subparcela, id_especie, altura_mt, diametro_cm, observaciones, coordenadas) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id_arbol`,
      [id_subparcela, id_especie_val, altura_mt, diametro_cm, observaciones, coordenadas]
    );

    const id_arbol = resultArbol.rows[0].id_arbol;

    let id_muestra = null;

    if (identificador && tipo && fecha_recoleccion) {
      const resultMuestra = await pool.query(
        `INSERT INTO muestra (identificador, id_arbol, tipo, fecha_recoleccion)
         VALUES ($1, $2, $3, $4)
         RETURNING id_muestra`,
        [identificador, id_arbol, tipo, fecha_recoleccion]
      );

      id_muestra = resultMuestra.rows[0].id_muestra;

      if (imagenBuffer) {
        await pool.query(
          `INSERT INTO imagen_muestra (id_muestra, imagen)
           VALUES ($1, $2)`,
          [id_muestra, imagenBuffer]
        );
      }
    }

    res.status(201).json({
      mensaje: 'Árbol registrado con éxito',
      id_arbol,
      id_muestra: id_muestra || null,
      imagen_guardada: !!imagenBuffer && !!id_muestra
    });

  } catch (err) {
    console.error('Error al registrar:', err.message);
    res.status(500).json({ error: 'Error al registrar los datos.' });
  }
});


// Ruta para actualizar árbol, muestra y opcionalmente imagen
router.put('/gestion_arbol/:id_arbol', upload.single('imagen'), async (req, res) => {
  const id_arbol = req.params.id_arbol;

  const {
    id_subparcela,
    id_especie,
    altura_mt,
    diametro_cm,
    observaciones,
    coordenadas,
    identificador,
    tipo,
    fecha_recoleccion
  } = req.body;

  const imagenBuffer = req.file ? req.file.buffer : null;
  const id_especie_val = (id_especie === undefined || id_especie === null || id_especie === '') 
    ? null 
    : parseInt(id_especie, 10);

  try {
    // 1. Actualizar árbol
    await pool.query(
      `UPDATE arbol
       SET id_subparcela = $1,
           id_especie = $2,
           altura_mt = $3,
           diametro_cm = $4,
           observaciones = $5,
           coordenadas = $6
       WHERE id_arbol = $7`,
      [id_subparcela, id_especie_val, altura_mt, diametro_cm, observaciones, coordenadas, id_arbol]
    );

    // 2. Verificar si ya existe muestra para este árbol
    const resultMuestra = await pool.query(
      `SELECT id_muestra FROM muestra WHERE id_arbol = $1`,
      [id_arbol]
    );

    if (resultMuestra.rows.length > 0) {
      const id_muestra = resultMuestra.rows[0].id_muestra;

      await pool.query(
        `UPDATE muestra
         SET identificador = $1,
             tipo = $2,
             fecha_recoleccion = $3
         WHERE id_muestra = $4`,
        [identificador, tipo, fecha_recoleccion, id_muestra]
      );

      if (imagenBuffer) {
        const resultImagen = await pool.query(
          `SELECT id_imagen FROM imagen_muestra WHERE id_muestra = $1`,
          [id_muestra]
        );

        if (resultImagen.rows.length > 0) {
          await pool.query(
            `UPDATE imagen_muestra SET imagen = $1 WHERE id_muestra = $2`,
            [imagenBuffer, id_muestra]
          );
        } else {
          await pool.query(
            `INSERT INTO imagen_muestra (id_muestra, imagen) VALUES ($1, $2)`,
            [id_muestra, imagenBuffer]
          );
        }
      }

    } else {
      if (identificador && tipo && fecha_recoleccion) {
        const resultInsert = await pool.query(
          `INSERT INTO muestra (identificador, id_arbol, tipo, fecha_recoleccion)
           VALUES ($1, $2, $3, $4)
           RETURNING id_muestra`,
          [identificador, id_arbol, tipo, fecha_recoleccion]
        );

        const id_muestra = resultInsert.rows[0].id_muestra;

        if (imagenBuffer) {
          await pool.query(
            `INSERT INTO imagen_muestra (id_muestra, imagen) VALUES ($1, $2)`,
            [id_muestra, imagenBuffer]
          );
        }
      }
    }

    res.json({ mensaje: 'Datos actualizados correctamente' });

  } catch (err) {
    console.error('Error al actualizar:', err.message);
    res.status(500).json({ error: 'Error al actualizar los datos.' });
  }
});

module.exports = router;

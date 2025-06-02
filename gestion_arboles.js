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

  try {
    // Insertar árbol
    const resultArbol = await pool.query(
      `INSERT INTO arbol 
        (id_subparcela, id_especie, altura_mt, diametro_cm, observaciones, coordenadas) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id_arbol`,
      [id_subparcela, id_especie, altura_mt, diametro_cm, observaciones, coordenadas]
    );

    const id_arbol = resultArbol.rows[0].id_arbol;

    let id_muestra = null;

    // Insertar muestra si se enviaron datos
    if (identificador && tipo && fecha_recoleccion) {
      const resultMuestra = await pool.query(
        `INSERT INTO muestra (identificador, id_arbol, tipo, fecha_recoleccion)
         VALUES ($1, $2, $3, $4)
         RETURNING id_muestra`,
        [identificador, id_arbol, tipo, fecha_recoleccion]
      );

      id_muestra = resultMuestra.rows[0].id_muestra;

      // Insertar imagen si se envió archivo
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


module.exports = router;

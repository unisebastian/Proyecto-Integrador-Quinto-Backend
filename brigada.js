const express = require('express');
const router = express.Router();
const pool = require('./conexion.js'); // Tu conexión a PostgreSQL

router.get('/brigadistas_brigada', async (req, res) => {
  try {
    const query = `
      SELECT 
        id_usuario AS id_brigadista,
        nombre AS nombre_brigadista
      FROM brigadistas_ideam
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});


router.get('/brigada_conglomerado', async (req, res) => {
  try {
    const query = `
      SELECT 
        id_conglomerado AS id_conglomerado,
        identificador AS identificador_conglomerado
      FROM conglomerado
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});


// Ruta para crear una nueva brigada
router.post('/brigada', async (req, res) => {
  const {
    nombre,
    id_jefe_brigada,
    id_investigador,
    id_coinvestigador,
    id_conglomerado,
    fecha_visita
  } = req.body;

  try {
    const query = `
      INSERT INTO brigada (
        nombre,
        id_jefe_brigada,
        id_investigador,
        id_coinvestigador,
        id_conglomerado,
        fecha_visita
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      nombre,
      id_jefe_brigada,
      id_investigador,
      id_coinvestigador,
      id_conglomerado,
      fecha_visita
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json({
      mensaje: 'Brigada creada exitosamente',
      brigada: rows[0]
    });
  } catch (error) {
    console.error('Error al crear la brigada:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


// Ruta para obtener todas las brigadas con información detallada
router.get('/obtener_brigada', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id_brigada,
        b.nombre AS nombre_brigada,
        jefe.nombre AS nombre_jefe_brigada,
        investigador.nombre AS nombre_investigador,
        coinvestigador.nombre AS nombre_coinvestigador,
        c.identificador AS identificador_conglomerado,
        b.fecha_visita
      FROM brigada b
      JOIN brigadistas_ideam jefe ON b.id_jefe_brigada = jefe.id_usuario
      JOIN brigadistas_ideam investigador ON b.id_investigador = investigador.id_usuario
      JOIN brigadistas_ideam coinvestigador ON b.id_coinvestigador = coinvestigador.id_usuario
      JOIN conglomerado c ON b.id_conglomerado = c.id_conglomerado
      ORDER BY b.id_brigada DESC
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener brigadas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});



module.exports = router;

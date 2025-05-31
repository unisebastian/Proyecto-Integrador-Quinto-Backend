const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');


// GET - Listar todos
router.get('/gestion-conglomerado', async (req, res) => {
  try {
    const query = `
    SELECT 
      c.id_conglomerado,
      c.identificador,
      TO_CHAR(c.fecha_creacion, 'YYYY-MM-DD') AS fecha_creacion,
      TO_CHAR(c.fecha_establecimiento, 'YYYY-MM-DD') AS fecha_establecimiento,
      r.nombre AS nombre_region,
      m.nombre AS nombre_municipio,
      c.coordenadas AS coordenadas,
      d.nombre AS departamento,
      m.id_municipio AS id_municipio
    FROM conglomerado c
    JOIN region r ON r.id_region = c.id_region
    JOIN municipio m ON m.id_municipio = c.id_municipio
    JOIN departamento d ON d.id_departamento = m.id_departamento;
    `;

    const result = await pool.query(query);
    
    // Convertir fechas a formato ISO para que el cliente las interprete como Date
    const conglomerados = result.rows.map(row => ({
      id_conglomerado: row.id_conglomerado,
      identificador: row.identificador,
      fecha_creacion: row.fecha_creacion,        // Esto ya es Date en JS si configuras bien pg
      fecha_establecimiento: row.fecha_establecimiento,
      nombre_region: row.nombre_region,
      nombre_municipio: {"id": row.id_municipio, "nombre":row.nombre_municipio, "departamento": row.departamento},
      coordenadas: row.coordenadas
    }));

    res.json(conglomerados);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST - Crear nuevo conglomerado con nombres de región y municipio
router.post('/gestion-conglomerado', async (req, res) => {
  const {
    identificador,
    fecha_establecimiento,
    fecha_creacion,
    id_region,
    id_municipio,
    coordenadas
  } = req.body;

  console.log('POST /gestion-conglomerado', req.body);

  try {
    // Insertar el conglomerado y obtener el registro insertado
    const insertResult = await pool.query(
      `INSERT INTO conglomerado 
        (identificador, fecha_establecimiento, fecha_creacion, id_region, id_municipio, coordenadas) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [identificador, fecha_establecimiento, fecha_creacion, id_region, id_municipio, coordenadas]
    );

    const nuevoConglomerado = insertResult.rows[0];
    const idConglomerado = nuevoConglomerado.id_conglomerado;

    // Datos fijos para las 5 subparcelas
    const subparcelasData = [
      { numero: 2, direccion: 'Norte' },
      { numero: 4, direccion: 'Sur' },
      { numero: 3, direccion: 'Este' },
      { numero: 5, direccion: 'Oeste' },
      { numero: 1, direccion: 'Centro' }
    ];

    // Insertar las subparcelas vinculadas al conglomerado
    const insertSubparcelasPromises = subparcelasData.map(({ numero, direccion }) =>
      pool.query(
        `INSERT INTO subparcela (id_conglomerado, numero, direccion)
         VALUES ($1, $2, $3)`,
        [idConglomerado, numero, direccion]
      )
    );

    await Promise.all(insertSubparcelasPromises);

    res.status(201).json({
      conglomerado: nuevoConglomerado,
      mensaje: 'Conglomerado y 5 subparcelas creados correctamente'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// ✅ PUT - Editar conglomerado
router.put('/gestion-conglomerado/:id', async (req, res) => {
  const { id } = req.params;
  const { identificador, fecha_establecimiento, fecha_creacion, id_region, id_municipio, coordenadas} = req.body;
  try {
    const result = await pool.query(
      `UPDATE conglomerado 
       SET identificador=$1, fecha_establecimiento=$2, fecha_creacion=$3, id_region=$4, id_municipio=$5, coordenadas=$6
       WHERE id_conglomerado=$7 RETURNING *`,
      [ identificador, fecha_establecimiento, fecha_creacion, id_region, id_municipio, coordenadas, id ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE - Eliminar conglomerado
router.delete('/gestion-conglomerado/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM subparcela WHERE id_conglomerado = $1', [id]);
    await pool.query('DELETE FROM conglomerado WHERE id_conglomerado = $1', [id]);
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET - Obtener por ID (para editar)
router.get('/gestion-conglomerado/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        c.id_conglomerado,
        c.identificador,
        c.fecha_creacion,
        c.fecha_establecimiento,
        r.nombre AS nombre_region,
        m.nombre AS nombre_municipio,
        c.coordenadas AS coordenadas,
        d.nombre AS departamento,
        m.id_municipio AS id_municipio
      FROM conglomerado c
      JOIN region r ON r.id_region = c.id_region
      JOIN municipio m ON m.id_municipio = c.id_municipio
      JOIN departamento d ON d.id_departamento = m.id_departamento  WHERE id_conglomerado = $1
    `;
    const result = await pool.query(query, [id]);
    const conglomerados = result.rows.map(row => ({
      id_conglomerado: row.id_conglomerado,
      identificador: row.identificador,
      fecha_creacion: row.fecha_creacion,        // Esto ya es Date en JS si configuras bien pg
      fecha_establecimiento: row.fecha_establecimiento,
      nombre_region: row.nombre_region,
      nombre_municipio: {"id": row.id_municipio, "nombre":row.nombre_municipio, "departamento": row.departamento},
      coordenadas: row.coordenadas
    }));

    res.json(conglomerados[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('./conexion.js'); // Tu conexión a PostgreSQL

router.get('/reporte_conglomerado', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id_conglomerado,
        c.identificador,
        COUNT(a.id_arbol) AS cantidad_arboles
      FROM conglomerado c
      LEFT JOIN subparcela s ON c.id_conglomerado = s.id_conglomerado
      LEFT JOIN arbol a ON s.id_subparcela = a.id_subparcela
      GROUP BY c.id_conglomerado, c.identificador
      ORDER BY c.id_conglomerado;
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});

router.get('/reporte_region_conglomerados', async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id_region,
        r.nombre AS nombre_region,
        COUNT(c.id_conglomerado) AS cantidad_conglomerados
      FROM region r
      LEFT JOIN conglomerado c ON r.id_region = c.id_region
      GROUP BY r.id_region, r.nombre
      ORDER BY r.id_region;
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});

router.get('/reporte_especies_mas_arboles', async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id_especie,
        e.nombre_comun,
        e.nombre_cientifico,
        COUNT(a.id_arbol) AS cantidad_arboles
      FROM especie e
      JOIN arbol a ON e.id_especie = a.id_especie
      GROUP BY e.id_especie, e.nombre_comun, e.nombre_cientifico
      ORDER BY cantidad_arboles DESC;
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});


router.get('/reporte_conglomerados_mas_especies', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id_conglomerado,
        c.identificador,
        COUNT(DISTINCT a.id_especie) AS cantidad_especies
      FROM conglomerado c
      JOIN subparcela s ON c.id_conglomerado = s.id_conglomerado
      JOIN arbol a ON s.id_subparcela = a.id_subparcela
      GROUP BY c.id_conglomerado, c.identificador
      ORDER BY cantidad_especies DESC;
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});


router.get('/reporte_total_arboles', async (req, res) => {
  try {
    const query = `SELECT COUNT(*) AS total_arboles FROM arbol;`;
    const { rows } = await pool.query(query);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).send('Error del servidor');
  }
});


module.exports = router;

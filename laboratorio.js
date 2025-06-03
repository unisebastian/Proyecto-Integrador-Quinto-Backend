const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');

router.get('/laboratorio', async (req, res) => {
  try {
    const query = `
      SELECT 
        m.id_muestra,
        c.identificador AS conglomerado,
        s.numero AS numero_subparcela,
        e.id_especie,
        a.altura_mt AS altura_arbol,
        a.diametro_cm AS diametro_arbol,
        a.observaciones AS observaciones,
        m.identificador AS identificador_muestra,
        m.tipo AS tipo_muestra,
        i.imagen AS imagen_muestra
      FROM muestra m
      LEFT JOIN arbol a ON m.id_arbol = a.id_arbol
      LEFT JOIN subparcela s ON a.id_subparcela = s.id_subparcela
      LEFT JOIN conglomerado c ON s.id_conglomerado = c.id_conglomerado
      LEFT JOIN especie e ON a.id_especie = e.id_especie
      LEFT JOIN imagen_muestra i ON i.id_muestra = m.id_muestra
    `;

    const { rows } = await pool.query(query);

    // Agrupar por id_muestra si llegan múltiples filas
    const agrupado = new Map();

    for (const row of rows) {
      const id = row.id_muestra;

      if (!agrupado.has(id)) {
        agrupado.set(id, {
          id_muestra: row.id_muestra,
          conglomerado: row.conglomerado || '',
          numero_subparcela: row.numero_subparcela || '',
          id_especie: row.id_especie || null,
          altura_arbol: row.altura_arbol || '',
          diametro_arbol: row.diametro_arbol || '',
          observaciones: row.observaciones || '',
          identificador_muestra: row.identificador_muestra || '',
          tipo_muestra: row.tipo_muestra || '',
          imagen_muestra: row.imagen_muestra
            ? Buffer.from(row.imagen_muestra).toString('base64')
            : null
        });
      }
    }

    res.json(Array.from(agrupado.values()));
  } catch (err) {
    console.error('Error al consultar laboratorio:', err);
    res.status(500).send('Error del servidor');
  }
});




module.exports = router;

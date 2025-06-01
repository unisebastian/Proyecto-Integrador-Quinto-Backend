const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');

router.get('/conglomerado_subparcela', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id_conglomerado,
        c.identificador,
        s.id_subparcela AS id_subparcela,
        s.numero AS numero_subparcela
      FROM conglomerado c
      JOIN subparcela s ON s.id_conglomerado = c.id_conglomerado;
    `;

    const result = await pool.query(query);

    const conglomerados = result.rows.map(row => ({
      id_conglomerado: row.id_conglomerado,
      identificador: row.identificador,
      subparcela: {
        id_subparcela: row.id_subparcela,
        numero_subparcela: row.numero_subparcela
      }
    }));

    res.json(conglomerados);

  } catch (err) {
    console.error('ERROR EN API:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

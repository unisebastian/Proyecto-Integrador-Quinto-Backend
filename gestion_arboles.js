const express = require('express');
const router = express.Router();
const pool = require('./conexion.js');

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

module.exports = router;

require('dotenv').config(); // Cargar el archivo .env

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error al conectar con PostgreSQL:', err.stack);
  }
  console.log('✅ Conectado exitosamente a PostgreSQL (Neon)');
  release();
});


module.exports = pool;

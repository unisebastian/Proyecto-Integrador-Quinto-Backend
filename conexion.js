const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'maglev.proxy.rlwy.net',
  port: 18996,
  user: 'root',
  password: 'nNhncEkethFlAcsOzEUgSzjwockBhwnh',
  database: 'railway'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la BD:', err);
    return;
  }
  console.log('✅ Conectado exitosamente a Railway con mysql2');
});

module.exports = connection;

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql.railway.internal',
  port: 3306,
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

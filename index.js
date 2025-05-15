const express = require('express');
const app = express();
const connection = require('./BD/conexion.js');
const imagenArbolRouter = require('./mostrar_imagen');
const mostrarEspecie = require('./mostrar_especie');
const mostrarUsuarios = require('./usuarios');


app.use(express.json());

// 👇 habilita CORS si vas a consumir desde Angular
const cors = require('cors');
app.use(cors());

// Ruta de prueba
// app.get('/usuarios', (req, res) => {
//   connection.query('SELECT * FROM usuarios', (err, results) => {
//     if (err) {
//       console.error('Error en la consulta:', err);
//       return res.status(500).send('Error en la consulta');
//     }
//     res.json(results);
//   });
// });


app.use('/api', mostrarUsuarios);

// 👇 Ruta para imágenes
app.use('/api', imagenArbolRouter); // esto activa /imagen_arbol/:id

// Ruta para mostrar especie
app.use('/api', mostrarEspecie);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

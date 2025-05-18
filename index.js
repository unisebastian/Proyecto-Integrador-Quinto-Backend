require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


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

const usuarioRoutes = require('./mostrar_imagen.js');

const usuarioRoutes = require('./mostrar_especie.js');



// Montar las rutas con prefijo `/api`
app.use('/api', usuarioRoutes);

app.use('/api', mostrarUsuarios);

// 👇 Ruta para imágenes
app.use('/api', imagenArbolRouter); // esto activa /imagen_arbol/:id

// Ruta para mostrar especie
app.use('/api', mostrarEspecie);

// Servidor


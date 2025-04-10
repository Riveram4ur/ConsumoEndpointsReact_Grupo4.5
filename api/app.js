const express = require('express'); // inicializar express
const filmRoutes = require('./routes/films'); // cargar ruta de films
const authRoutes = require('./routes/auth'); // cargar ruta de auth
const cors = require('cors');
const app = express();
 
app.use(cors());
app.use(express.json()); //inicializar express con JSON
app.use('/api/films', filmRoutes); // inicializar la ruta
app.use('/api/auth', authRoutes); // inicializar la ruta
module.exports = app;

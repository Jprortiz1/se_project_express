require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
const { PORT, MONGODB_URI } = require('./utils/config');

const app = express();

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      // 'https://tu-frontend.com', // agrega tu frontend en prod si aplica
    ],
    credentials: true,
  }),
);

// Parseo JSON
app.use(express.json());

// Conexión a Mongo
mongoose.connect(MONGODB_URI, { autoIndex: true });

// (Opcional) Healthcheck sencillo
app.get('/', (req, res) => res.send('API OK'));

// Rutas
app.use(routes);

// 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).send({ message: 'Not found' });
});

// Manejador de errores genérico
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
});

// Inicio del servidor
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

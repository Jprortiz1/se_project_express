require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
const { PORT, MONGODB_URI } = require('./utils/config');
const { INTERNAL_SERVER_ERROR } = require('./utils/errors'); // ✅ constante en lugar de número

const app = express();

// ===========================
// CORS
// ===========================
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      // 'https://tu-frontend.com', // agrega tu frontend en producción si aplica
    ],
    credentials: true,
  }),
);

// ===========================
// Middleware de parseo JSON
// ===========================
app.use(express.json());

// ===========================
// Conexión a MongoDB
// ===========================
mongoose.connect(MONGODB_URI, { autoIndex: true });

// ===========================
// Healthcheck (opcional)
// ===========================
app.get('/', (req, res) => res.send('API OK'));

// ===========================
// Rutas principales
// ===========================
app.use(routes);

// ===========================
// Middleware 404 Not Found
// ===========================
app.use((req, res) => {
  res.status(404).send({ message: 'Not found' });
});

// ===========================
// Manejador genérico de errores
// ===========================
app.use((err, req, res) => {
  console.error(err);
  res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
});

// ===========================
// Inicio del servidor
// ===========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

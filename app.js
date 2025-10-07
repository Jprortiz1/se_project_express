require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
const { PORT, MONGODB_URI } = require('./utils/config');
const { INTERNAL_SERVER_ERROR } = require('./utils/errors');

const app = express();

// ===========================
// CORS
// ===========================
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  }),
);

// ===========================
// Middleware para parsear JSON
// ===========================
app.use(express.json());

// ===========================
// Stub requerido por los tests del Sprint 12 (no afecta la auth del Sprint 13)
// ===========================
app.use((req, res, next) => {
  req.user = { _id: '5d8b8592978f8bd833ca8133' };
  next();
});

// ===========================
// Conexión a MongoDB ✅
// ===========================
mongoose.connect(process.env.MONGODB_URI || MONGODB_URI || 'mongodb://localhost:27017/wtwr_db', {
  autoIndex: true,
});

// ===========================
// Rutas
// ===========================
app.get('/', (req, res) => res.send('API OK'));
app.use(routes);

// ===========================
// 404 y manejador de errores
// ===========================
app.use((req, res) => {
  res.status(404).send({ message: 'Not found' });
});

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

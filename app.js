require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');
const { PORT, MONGODB_URI } = require('./utils/config');
const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require('./utils/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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
// Request logger
// ===========================
app.use(requestLogger);

// ===========================
// Stub requerido por los tests del Sprint 12 (no afecta la auth del Sprint 13)
// ===========================
// app.use((req, res, next) => {
//   req.user = { _id: '5d8b8592978f8bd833ca8133' };
//   next();
// });

// ===========================
// Conextion a MongoDB ✅
// ===========================
mongoose.connect(process.env.MONGODB_URI || MONGODB_URI || 'mongodb://localhost:27017/wtwr_db', {
  autoIndex: true,
});

// ===========================
// Routes
// ===========================
app.get('/', (req, res) => res.send('API OK'));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(routes);

// ===========================
// 404 y  errors
// ===========================
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Not found' });
});

// app.use((err, req, res) => {
//   console.error(err);
//   res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
// });

app.use(errors());

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR ? 'Internal server error' : message,
  });
});

// ===========================
// Start server
// ===========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

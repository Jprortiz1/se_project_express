// app.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors: celebrateErrors } = require('celebrate');

const routes = require('./routes');
const { PORT, MONGODB_URI } = require('./utils/config');
const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require('./utils/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

/* -------------------------------- CORS ---------------------------------- */
app.use(
  cors({
    origin: ['http://gcp-prueba.crabdance.com', 'http://www.gcp-prueba.crabdance.com'],
    credentials: true,
  }),
);

/* ---------------------------- Parseo de JSON ----------------------------- */
app.use(express.json());

/* ------------------------- Logger de solicitudes ------------------------- */
app.use(requestLogger);

/* ------------------------- Conexión a MongoDB ---------------------------- */
mongoose.connect(process.env.MONGODB_URI || MONGODB_URI || 'mongodb://localhost:27017/wtwr_db', {
  autoIndex: true,
});

/* ------------------------------- Healthcheck ----------------------------- */
app.get('/', (_req, res) => res.send('API OK'));

/* ------------------------------ Crash test ------------------------------- */
/* Requerido por la revisión: antes de /signin y /signup */
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

/* -------------------------------- Rutas ---------------------------------- */
app.use(routes);

/* ------------------------------- 404 plano ------------------------------- */
app.use((_req, res) => {
  res.status(NOT_FOUND).send({ message: 'Not found' });
});

/* -------------------------- Logger de errores ---------------------------- */
app.use(errorLogger);

/* --------------------- Errores de celebrate/joi -------------------------- */
app.use(celebrateErrors());

/* ----------------------- Manejador central de errores -------------------- */
/* eslint-disable-next-line no-unused-vars */
app.use((err, _req, res, _next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR ? 'Internal server error' : message,
  });
});

/* ------------------------------- Arranque -------------------------------- */
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

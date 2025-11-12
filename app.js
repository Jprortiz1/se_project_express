// app.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors: celebrateErrors } = require('celebrate');

const routes = require('./routes');
const { MONGODB_URI } = require('./utils/config'); // <-- PORT ya no se usa aquí
const { NotFoundError } = require('./utils/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

/* -------------------------------- CORS ---------------------------------- */
app.use(cors({
  origin: ['https://gcp-prueba.crabdance.com', 'https://www.gcp-prueba.crabdance.com'],
  credentials: true,
}));

/* ---------------------------- Parseo de JSON ----------------------------- */
app.use(express.json());

/* ------------------------- Logger de solicitudes ------------------------- */
app.use(requestLogger);

/* ------------------------- Conexión a MongoDB ---------------------------- */
// Evita conectar en tests (opcional pero recomendado para CI)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI || MONGODB_URI || 'mongodb://localhost:27017/wtwr_db', {
    autoIndex: true,
  });
}

/* ------------------------------- Healthcheck ----------------------------- */
app.get('/', (_req, res) => res.send('API OK'));

/* ------------------------------ Crash test ------------------------------- */
app.get('/crash-test', () => {
  setTimeout(() => { throw new Error('Server will crash now'); }, 0);
});

/* -------------------------------- Rutas ---------------------------------- */
app.use(routes);

/* ------------------------------- 404 → throw ----------------------------- */
app.use((req, res, next) => next(new NotFoundError('Requested resource not found')));

/* -------------------------- Logger de errores ---------------------------- */
app.use(errorLogger);

/* --------------------- Errores de celebrate/joi -------------------------- */
app.use(celebrateErrors());

/* ----------------------- Manejador central de errores -------------------- */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  res.status(statusCode).send({ message });
});


/* -------------------- EXPORTA LA APP (no levantar aquí) ------------------ */
module.exports = app;

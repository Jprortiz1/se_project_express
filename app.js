require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
const { PORT, MONGODB_URI } = require('./utils/config');
const { INTERNAL_SERVER_ERROR } = require('./utils/errors');

const app = express();

// CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  }),
);

app.use(express.json());

// 🔴 Fallback explícito requerido por los tests (debe estar en app.js)
const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/wtwr_db';

// Conexión a MongoDB (usa env/config o cae al default literal)
mongoose.connect(MONGODB_URI || DEFAULT_MONGO_URI, { autoIndex: true });

app.get('/', (req, res) => res.send('API OK'));

app.use(routes);

app.use((req, res) => {
  res.status(404).send({ message: 'Not found' });
});

app.use((err, req, res) => {
  console.error(err);
  res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

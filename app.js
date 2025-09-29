const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

app.use(express.json());
app.use((req, res, next) => {
  req.user = { _id: '68d99f2aafbfef8e526f0fbc' };
  next();
});

// monta rutas antes del 404
app.use(routes);

// 404
app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

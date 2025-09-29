// app.js
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

app.use(express.json());

// Temporary auth: inject a fixed test user until real auth is implemented
app.use((req, res, next) => {
  req.user = { _id: '68d99f2aafbfef8e526f0fbc' };
  next();
});

// Mount routes before the 404 handler
app.use(routes);

// 404
app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

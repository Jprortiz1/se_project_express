// utils/config.js
const {
  PORT = 3001,
  MONGODB_URI = 'mongodb://localhost:27017/wtwr_db', // 👈 default requerido por los tests
  JWT_SECRET = 'super-strong-secret',
} = process.env;

module.exports = { PORT, MONGODB_URI, JWT_SECRET };

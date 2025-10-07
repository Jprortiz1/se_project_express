// Centraliza configuraciones que luego ocultarás del repo
const {
  JWT_SECRET = 'super-strong-secret',
  PORT = 3001,
  MONGODB_URI = 'mongodb://127.0.0.1:27017/wtwr_db',
} = process.env;

module.exports = {
  JWT_SECRET,
  PORT,
  MONGODB_URI,
};

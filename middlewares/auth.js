// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { UnauthorizedError } = require('../utils/errors'); // ✅ importa la clase

module.exports = (req, res, next) => {
  const { authorization = '' } = req.headers;

  if (!authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization required'));
  }

  const token = authorization.slice(7); // remueve "Bearer "

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { _id: ... }
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};

// controllers/users.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');

const { CREATED, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, CONFLICT } = require('../utils/errors');

// ===============================
// POST /signup → Crear usuario
// ===============================
module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!password) {
    return res.status(BAD_REQUEST).send({ message: 'Password is required' });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      // Garantizamos que no se devuelva el hash
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(CREATED).send(userObj);
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: 'EMAIL_IN_USE' });
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(BAD_REQUEST).send({ message: messages.join(', ') });
      }
      return next(err);
    });
};

// ===============================
// POST /signin → Iniciar sesión
// ===============================
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: 'Email and password are required' });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'EMAIL_NOT_FOUND') {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }
      if (err.message === 'WRONG_PASSWORD') {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }
      return next(err);
    });
};

// ==================================
// GET /users/me → Usuario actual
// ==================================
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id; // viene del token JWT

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid user ID format' });
      }
      return next(err);
    });
};

// ============================================
// PATCH /users/me → Actualizar usuario actual
// ============================================
module.exports.updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(BAD_REQUEST).send({ message: messages.join(', ') });
      }
      return next(err);
    });
};

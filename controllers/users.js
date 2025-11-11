// controllers/users.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');

const { CREATED, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, CONFLICT } = require('../utils/errors');

// ===============================
// POST /signup → Crear usuario
// ===============================
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!password) {
      // ❌ No respondas aquí con res.status(...)
      // ✅ Lanza error para que lo maneje el middleware central
      throw new BadRequestError('Password is required');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });

    // Evitar devolver el hash
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(CREATED || 201).send(userObj);
  } catch (err) {
    // Duplicado de índice único (email)
    if (err && err.code === 11000) {
      return next(new ConflictError('EMAIL_IN_USE'));
    }
    // Errores de validación de mongoose
    if (err && err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return next(new BadRequestError(messages.join(', ')));
    }
    // Delegar cualquier otro error
    return next(err);
  }
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

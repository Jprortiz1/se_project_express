// controllers/users.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');

// Importa tus clases de error centralizadas
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../utils/errors');

// ===============================
// POST /signup → Crear usuario
// ===============================
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!password) {
      throw new BadRequestError('Password is required');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });

    // No devolver el hash
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).send(userObj);
  } catch (err) {
    if (err && err.code === 11000) {
      return next(new ConflictError('EMAIL_IN_USE'));
    }
    if (err && err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return next(new BadRequestError(messages.join(', ')));
    }
    return next(err);
  }
};

// ===============================
// POST /signin → Iniciar sesión
// ===============================
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email and password are required'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch((err) => {
      // Mapea los errores de tu helper a Unauthorized centralizado
      if (err.message === 'EMAIL_NOT_FOUND' || err.message === 'WRONG_PASSWORD') {
        return next(new UnauthorizedError('Incorrect email or password'));
      }
      return next(err);
    });
};

// ==================================
// GET /users/me → Usuario actual
// ==================================
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid user ID format'));
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
        return next(new NotFoundError('User not found'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return next(new BadRequestError(messages.join(', ')));
      }
      return next(err);
    });
};

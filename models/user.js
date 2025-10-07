const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
        message: 'Invalid URL format',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // 🔹 el hash no se incluye en consultas normales
    },
  },
  { versionKey: false, timestamps: true },
);

// ==========================================
// Método estático personalizado para login
// ==========================================
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password') // 🔹 traemos el hash manualmente
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('AUTH_FAILED'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('AUTH_FAILED'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);

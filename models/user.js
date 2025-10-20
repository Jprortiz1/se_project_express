// models/user.js
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
        message: 'INVALID_AVATAR_URL',
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
        message: 'INVALID_EMAIL_FORMAT',
      },
    },
    password: {
      type: String,
      required: true,
      // No minlength aquí: el hash siempre tiene longitud fija
      select: false,
    },
  },
  { versionKey: false, timestamps: true },
);

// ==========================================
// Método estático personalizado para login
// ==========================================
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('EMAIL_NOT_FOUND'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('WRONG_PASSWORD'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);

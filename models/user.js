const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 30, trim: true },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'You must enter a valid URL',
      },
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = model('User', userSchema);

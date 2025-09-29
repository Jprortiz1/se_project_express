const { Schema, model, Types } = require('mongoose');
const validator = require('validator');

const clothingItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    weather: {
      type: String,
      required: true,
      enum: ['hot', 'warm', 'cold'], // debe coincidir con tu frontend
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return validator.isURL(value);
        },
        message: 'You must enter a valid URL',
      },
    },
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: 'User',
        default: undefined, // array vacío por defecto (sin crear campo si no hay likes)
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { versionKey: false },
);

module.exports = model('ClothingItem', clothingItemSchema);

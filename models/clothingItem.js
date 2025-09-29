// models/clothingItem.js
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
      enum: ['hot', 'warm', 'cold'],
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'You must enter a valid URL',
      },
    },
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ✅ default en el path del array
    likes: {
      type: [{ type: Types.ObjectId, ref: 'User' }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { versionKey: false },
);

module.exports = model('ClothingItem', clothingItemSchema);

// controllers/clothingItems.js
const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');

// Asegúrate de exportar estas clases desde ../utils/errors/index.js
const {
  AppError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../utils/errors');

// ========== GET /items (público)
module.exports.getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    return res.send(items);
  } catch (err) {
    return next(err instanceof Error ? err : new AppError('Unexpected error', 500));
  }
};

// ========== POST /items (protegido)
module.exports.createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user && req.user._id;

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).send(item);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError(
          Object.values(err.errors).map((e) => e.message).join(', ') || 'Invalid data'
        )
      );
    }
    return next(err);
  }
};

// ========== DELETE /items/:itemId (protegido, SOLO dueño)
module.exports.deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user && req.user._id;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return next(new BadRequestError('Invalid item id'));
    }

    const item = await ClothingItem.findById(itemId)
      .orFail(() => new NotFoundError('Item not found'));

    if (item.owner.toString() !== userId) {
      return next(new ForbiddenError('Forbidden: not the owner'));
    }

    await item.deleteOne();
    return res.send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid data'));
    }
    return next(err);
  }
};

// ========== PUT /items/:itemId/likes (protegido)
module.exports.likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user && req.user._id;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return next(new BadRequestError('Invalid item id'));
    }

    const updated = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(() => new NotFoundError('Item not found'));

    return res.send(updated);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid data'));
    }
    return next(err);
  }
};

// ========== DELETE /items/:itemId/likes (protegido)
module.exports.dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user && req.user._id;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return next(new BadRequestError('Invalid item id'));
    }

    const updated = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(() => new NotFoundError('Item not found'));

    return res.send(updated);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid data'));
    }
    return next(err);
  }
};

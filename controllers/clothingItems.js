// controllers/clothingItems.js
const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');
const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  CREATED,
} = require('../utils/errors');

// GET /items (público)
module.exports.getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.send(items);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};

// POST /items (protegido)
module.exports.createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user && req.user._id;

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(CREATED).send(item);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};

// DELETE /items/:itemId (protegido, SOLO dueño)
module.exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user && req.user._id;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).send({ message: 'Invalid item id' });
    }

    const item = await ClothingItem.findById(itemId).orFail();

    if (item.owner.toString() !== userId) {
      // 403 si no es el dueño
      return res.status(FORBIDDEN).send({ message: 'Forbidden: not the owner' });
    }

    // elimina y devuelve el documento eliminado (contrato: devolver el item, no un envoltorio)
    await item.deleteOne();
    return res.send(item); // devolver el objeto directo
  } catch (err) {
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Item not found' });
    }
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};

// PUT /items/:itemId/likes (protegido)
module.exports.likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).send({ message: 'Invalid item id' });
    }

    const updated = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).orFail();

    return res.send(updated);
  } catch (err) {
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Item not found' });
    }
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};

// DELETE /items/:itemId/likes (protegido)
module.exports.dislikeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).send({ message: 'Invalid item id' });
    }

    const updated = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true },
    ).orFail();

    return res.send(updated);
  } catch (err) {
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'Item not found' });
    }
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};

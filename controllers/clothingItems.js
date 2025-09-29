// controllers/clothingItems.js
const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

// GET /items
module.exports.getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.send(items);
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
  }
};

// POST /items
module.exports.createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user && req.user._id;

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).send(item);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};

// DELETE /items/:itemId
module.exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).send({ message: 'Invalid item id' });
    }

    const item = await ClothingItem.findById(itemId).orFail();
    await item.deleteOne();

    return res.send({ message: 'Item deleted', item });
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

// PUT /items/:itemId/likes
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

// DELETE /items/:itemId/likes
module.exports.unlikeItem = async (req, res) => {
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

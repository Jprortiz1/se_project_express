const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR } = require('../utils/errors');

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

module.exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user && req.user._id;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).send({ message: 'Invalid item id' });
    }

    const item = await ClothingItem.findById(itemId).orFail();

    if (item.owner.toString() !== userId) {
      return res.status(FORBIDDEN).send({ message: 'Forbidden: not the owner' });
    }

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

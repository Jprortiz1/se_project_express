// controllers/users.js
const mongoose = require('mongoose');
const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

// GET /users
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
  }
};

// GET /users/:userId
module.exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // si el id no tiene formato válido, devolvemos 400
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(BAD_REQUEST).send({ message: 'Invalid user id' });
    }

    // orFail lanza DocumentNotFoundError si no existe -> 404
    const user = await User.findById(userId).orFail();
    return res.send(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(NOT_FOUND).send({ message: 'User not found' });
    }
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};

// POST /users
module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const doc = await User.create({ name, avatar });
    return res.status(201).send(doc);
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

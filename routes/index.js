const router = require('express').Router();

const userRoutes = require('./users');
const itemRoutes = require('./clothingItems');

// monta subrouters
router.use('/users', userRoutes);
router.use('/items', itemRoutes);

module.exports = router;

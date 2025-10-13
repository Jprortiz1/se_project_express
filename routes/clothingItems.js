// routes/clothingitems.js
const router = require('express').Router();
const { createItem, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingItems');
// routes/index.js con prefijo /items
router.post('/', createItem);
router.delete('/:itemId', deleteItem);

// Likes
// LIKE   → PUT   /items/:itemId/likes
// UNLIKE → DELETE /items/:itemId/likes
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;

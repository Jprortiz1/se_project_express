const router = require('express').Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

// GET /items  (público; se monta como router.get('/items', getItems) en routes/index.js)
router.get('/', getItems);

// Estas rutas se montan detrás de auth en routes/index.js con prefijo /items
router.post('/', createItem);
router.delete('/:itemId', deleteItem);

// Likes según la convención del sprint:
// LIKE   → PUT   /items/:itemId/likes
// UNLIKE → DELETE /items/:itemId/likes
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;

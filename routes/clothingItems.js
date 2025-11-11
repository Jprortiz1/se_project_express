// routes/clothingitems.js
const router = require('express').Router();
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

// ⬅️ importa validaciones desde tu middlewares/validation.js
const {
  validateCreateItem,
  validateItemId,
} = require('../middlewares/validation');

// POST /items  (crear prenda)
router.post('/', validateCreateItem, createItem);

// DELETE /items/:itemId  (borrar prenda)
router.delete('/:itemId', validateItemId, deleteItem);

// PUT /items/:itemId/likes  (like)
router.put('/:itemId/likes', validateItemId, likeItem);

// DELETE /items/:itemId/likes  (dislike)
router.delete('/:itemId/likes', validateItemId, dislikeItem);

module.exports = router;

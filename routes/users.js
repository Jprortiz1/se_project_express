const router = require('express').Router();
const { getCurrentUser, updateCurrentUser } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', updateCurrentUser); // ← esta es la del paso 8

module.exports = router;

const router = require('express').Router();
const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');
const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');
const { getItems } = require('../controllers/clothingItems');

// 🔓 RUTAS PÚBLICAS (van ANTES del auth)
router.post('/signup', createUser);
router.post('/signin', login);
router.get('/items', getItems);

// 🔒 TODO LO DEMÁS REQUIERE TOKEN
router.use(auth);
router.use('/users', usersRouter);
router.use('/items', clothingItemsRouter);

module.exports = router;

// middlewares/validation.js
const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  const isOk = validator.isURL(value, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_host: true,
  });
  return isOk ? value : helpers.error('string.uri');
};

const objectId = Joi.string().hex().length(24).required();

// Users
const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

// ✅ Usaremos este para PATCH /users/me
const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().custom(validateURL).required(),
  }),
});

// Items
const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    imageUrl: Joi.string().custom(validateURL).required(),
    weather: Joi.string().valid('hot', 'warm', 'cold').required(),
  }),
});

const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: objectId,
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateUser,   // ⬅️ exportado
  validateCreateItem,
  validateItemId,
};

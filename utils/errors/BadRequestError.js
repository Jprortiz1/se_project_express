const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message, details) {
    super(message || 'Invalid data', 400, details);
  }
}
module.exports = BadRequestError;

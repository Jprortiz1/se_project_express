const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(message, details) {
    super(message || 'Not found', 404, details);
  }
}
module.exports = NotFoundError;

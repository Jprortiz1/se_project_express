const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message, details) {
    super(message || 'Authorization required', 401, details);
  }
}
module.exports = UnauthorizedError;

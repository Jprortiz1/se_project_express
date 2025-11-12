const AppError = require('./AppError');

class ForbiddenError extends AppError {
  constructor(message, details) {
    super(message || 'Forbidden', 403, details);
  }
}
module.exports = ForbiddenError;

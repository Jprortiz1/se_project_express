const AppError = require('./AppError');

class ConflictError extends AppError {
  constructor(message, details) {
    super(message || 'Conflict', 409, details);
  }
}
module.exports = ConflictError;

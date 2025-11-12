// utils/errors.js

// Clase base
class AppError extends Error {
  constructor(message = 'Error', statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    if (details) this.details = details;
  }
}

// 400
class BadRequestError extends AppError {
  constructor(message = 'Invalid data', details) {
    super(message, 400, details);
  }
}

// 401
class UnauthorizedError extends AppError {
  constructor(message = 'Authorization required', details) {
    super(message, 401, details);
  }
}

// 403
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details) {
    super(message, 403, details);
  }
}

// 404
class NotFoundError extends AppError {
  constructor(message = 'Not found', details) {
    super(message, 404, details);
  }
}

// 409
class ConflictError extends AppError {
  constructor(message = 'Conflict', details) {
    super(message, 409, details);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};

class AppError extends Error {
  constructor(message, statusCode, details) {
    super(message || 'Error');     // sin default param, se aplica aquí
    this.statusCode = statusCode ?? 500;
    if (details !== undefined) this.details = details;
  }
}
module.exports = AppError;

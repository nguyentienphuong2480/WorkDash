/**
 * AppError - Error với statusCode để global handler trả đúng HTTP status
 * @param {string} message - Thông báo lỗi
 * @param {number} statusCode - HTTP status (400, 401, 403, 404, 500)
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };

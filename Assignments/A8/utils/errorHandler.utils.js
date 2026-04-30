// Custom error class that carries an HTTP status code alongside the message.
// Extending the built-in Error keeps the stack trace intact.
// Same pattern as project/backend/utils/errorHandler.utils.js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message); // sets this.message
    this.statusCode = statusCode;
    this.success = false;

    // captures the stack trace excluding the constructor call itself
    // makes stack traces cleaner and easier to debug
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

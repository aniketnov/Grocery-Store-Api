class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // To differentiate between operational and programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

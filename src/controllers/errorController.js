import AppError from "./../utils/appError.js";

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.email;  // Extract the duplicate field value
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  const message = "invalid signature"
  return AppError(message, 401)
}

const handleTokenExpiredError = () => {
  const message = "jwt expired, please login again"
  return AppError(message, 401)
}

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    let error = { ...err };
    error.message = err.message;

    // Handle MongoDB Duplicate Key Error (code 11000)
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "JsonWebTokenError") error = handleJsonWebTokenError()
    if (err.name === "TokenExpiredError") error = handleTokenExpiredError()

    // Send error response in development
    sendErrorDev(error, req, res);
  } else {
    // Implement production error handling if necessary
    res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went wrong!'
    });
  }
};

function AppError(message, statusCode) {
  const error = new Error(message); // Create the error object without throwing

  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  error.isOperational = true;

  Error.captureStackTrace(error, AppError); // Capture the stack trace

  return error; // Return the custom error object
}

export default AppError;

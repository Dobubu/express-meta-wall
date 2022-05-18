const handleError = (errMessage, next, statusCode = 400) => {
  const customError = new Error(errMessage);

  customError.statusCode = statusCode;
  customError.isOperational = true;
  next(customError);
};

module.exports = handleError;
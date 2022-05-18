const handleError = (e, next, statusCode = 400) => {
  const customError = e;

  customError.statusCode = statusCode;
  customError.isOperational = true;
  next(customError);
};

module.exports = handleError;
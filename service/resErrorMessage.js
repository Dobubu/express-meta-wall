const resError = {
  dev(err, res) {
    res.status(err.statusCode).json({
      message: err.message,
      error: err,
      stack: err.stack
    });
  },
  prod(err, res) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        error: err.message
      });
    } else {
      console.error('出現重大錯誤', err);
  
      // response default error
      res.status(500).json({
        status: 'error',
        error: 'internal server error, something went wrong.'
      });
    }
  }
}

module.exports = resError;
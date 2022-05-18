const handleErrorAsync = cb => {
  return (req, res, next) => {
    cb(req, res, next).catch(error => next(error));
  };
};

module.exports = handleErrorAsync;
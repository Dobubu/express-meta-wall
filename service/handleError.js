const handleError = (res, e) => {
  const errorMsg = e.message || 'parse error.';

  res.status(400).json({
    'status': 'false',
    'message': errorMsg
  });
};

module.exports = handleError;
const handleError = (res, e) => {
  const errorMsg = e.message || 'parse error.';

  res.status(400).send({
    status: false,
    'message': errorMsg
  }).end();
};

module.exports = handleError;
const handleSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).send({
    status: true,
    data
  }).end();
};

module.exports = handleSuccess;
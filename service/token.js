const jwt = require('jsonwebtoken');

const handleSuccess = require('./handleSuccess');

const generateSendJWT = (user, res, statusCode = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  user.password = undefined;

  const dict = {
    token,
    name: user.name,
    id: user._id
  };

  handleSuccess(res, dict, statusCode);
};

module.exports = {
  generateSendJWT
};
const jwt = require('jsonwebtoken');

const User = require('../model/users');

const handleErrorAsync = require('../service/handleErrorAsync');
const handleError = require('../service/handleError');

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  };

  if (!token) {
    return handleError('尚未登入！', next, 401);
  };

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

  const currentUser = await User.findById(decoded.id);

  req.user = currentUser;

  next();
});

module.exports = { isAuth };
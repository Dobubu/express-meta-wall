const mongoose = require('mongoose');

const User = require('../model/users');
const Post = require('../model/posts');

const handleErrorAsync = require('../service/handleErrorAsync');
const handleError = require('../service/handleError');

const isValidObjectId = handleErrorAsync(async (req, res, next) => {
  const id = req.params.id;

  const isValid = mongoose.isObjectIdOrHexString(id);
  if(!isValid) {
    return handleError('The id is invalid.', next);
  };

  next();
});

const isValidUser = handleErrorAsync(async (req, res, next) => {
  const id = req.params.id;

  const isExist = await User.findById(id).exec();
  if(!isExist) {
    return handleError('User not exist.', next);
  };

  req.existUser = isExist;

  next();
});

const isValidPost = handleErrorAsync(async (req, res, next) => {
  const id = req.params.id;

  const isExist = await Post.findById(id).exec();
  if(!isExist) {
    return handleError('Post not exist.', next);
  };

  req.existPost = isExist;

  next();
});

module.exports = { isValidObjectId, isValidUser, isValidPost };

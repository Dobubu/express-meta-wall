var express = require('express');
var router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const usersControllers = require('../controllers/users');
const { isAuth } = require('../middleware/auth');
const { isValidObjectId, isValidUser } = require('../middleware/isValid');

router.get('/users', isAuth, usersControllers.fetchUsers);

router.delete('/users', isAuth, usersControllers.deleteUsers);

router.post('/user/sign_up', handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'Sign up'
   */

  usersControllers.signUp(req, res, next);
}));

router.post('/user/sign_in', handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'Sign in'
   */

  usersControllers.signIn(req, res, next);
}));

router.get('/user/profile/:id', isAuth, isValidObjectId, isValidUser, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'Get user profile'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  usersControllers.fetchProfile(req, res, next);
}));

router.patch('/user/profile', isAuth, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'Update user profile'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  usersControllers.updateProfile(req, res, next);
}));

router.post('/user/updatePassword', isAuth, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'Update user password'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  usersControllers.updatePassword(req, res, next);
}));

router.get('/user/likes/list', isAuth, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'Get user like list'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  usersControllers.fetchLikesList(req, res, next);
}));

router.post('/user/:id/follow', isAuth, isValidObjectId, isValidUser, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'Follow user by Id'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  usersControllers.followUser(req, res, next);
}));

router.delete('/user/:id/follow', isAuth, isValidObjectId, isValidUser, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'UnFollow user by Id'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  usersControllers.unFollowUser(req, res, next);
}));

router.get('/user/following/list', isAuth, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'Get user following list'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  usersControllers.fetchFollowingList(req, res, next);
}));

module.exports = router;

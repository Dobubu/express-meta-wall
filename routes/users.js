var express = require('express');
var router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const usersControllers = require('../controllers/users');
const { isAuth } = require('../middleware/auth');

router.get('/users', isAuth, usersControllers.fetchUsers);

router.post('/user/sign_up', handleErrorAsync(usersControllers.signUp));

router.post('/user/sign_in', handleErrorAsync(usersControllers.signIn));

router.get('/user/profile/:id', isAuth, handleErrorAsync(usersControllers.fetchProfile));

router.patch('/user/profile', isAuth, handleErrorAsync(usersControllers.updateProfile));

router.post('/user/updatePassword', isAuth, handleErrorAsync(usersControllers.updatePassword));

router.get('/user/likes/list', isAuth, handleErrorAsync(usersControllers.fetchLikesList));

router.post('/user/:id/follow', isAuth, handleErrorAsync(usersControllers.followUser));

router.delete('/user/:id/follow', isAuth, handleErrorAsync(usersControllers.unFollowUser));

module.exports = router;

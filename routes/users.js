var express = require('express');
var router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const usersControllers = require('../controllers/users');
const { isAuth } = require('../middleware/auth');

router.get('/users', isAuth, usersControllers.fetchUsers);

router.post('/user/sign_up', handleErrorAsync(usersControllers.signUp));

router.post('/user/sign_in', handleErrorAsync(usersControllers.signIn));

router.get('/user/profile', isAuth, handleErrorAsync(usersControllers.fetchProfile));

router.post('/user/updatePassword', isAuth, handleErrorAsync(usersControllers.updatePassword));

module.exports = router;

var express = require('express');
var router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const usersControllers = require('../controllers/users');

router.get('/', usersControllers.fetchUsers);

router.post('/sign_up', handleErrorAsync(usersControllers.signUp));

module.exports = router;

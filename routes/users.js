var express = require('express');
var router = express.Router();

const usersControllers = require('../controllers/users');

router.get('/', usersControllers.fetchUsers);

module.exports = router;

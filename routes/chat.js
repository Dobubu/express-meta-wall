const express = require('express');
const router = express.Router();

const { isAuth } = require('../middleware/auth');
const chatControllers = require('../controllers/chat');

router.get('/chats', isAuth, chatControllers.fetchMessageList);

router.delete('/chats', isAuth, chatControllers.deleteMessages);

module.exports = router;

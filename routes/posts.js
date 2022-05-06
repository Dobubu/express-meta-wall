var express = require('express');
var router = express.Router();

const postsControllers = require('../controllers/posts');

router.get('/',  postsControllers.fetchPostList);

router.delete('/', postsControllers.deletePost);

module.exports = router;

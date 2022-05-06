var express = require('express');
var router = express.Router();

const postsControllers = require('../controllers/posts');

router.get('/', (req, res, next) => {
  postsControllers.fetchPostList(res);
});

router.delete('/', (req, res, next) => {
  postsControllers.deletePost(res);
});

module.exports = router;

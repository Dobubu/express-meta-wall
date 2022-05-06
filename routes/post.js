var express = require('express');
var router = express.Router();

const postsControllers = require('../controllers/posts');

router.post('/',postsControllers.createPost);

router.patch('/:id', postsControllers.updatePostByID);

router.delete('/:id', postsControllers.deletePostByID);

module.exports = router;

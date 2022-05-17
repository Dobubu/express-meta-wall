var express = require('express');
var router = express.Router();

const postsControllers = require('../controllers/posts');

router.get('/posts', postsControllers.fetchPostList);

router.post('/post', postsControllers.createPost);

router.patch('/post/:id', postsControllers.updatePostByID);

router.delete('/posts', postsControllers.deletePost);

router.delete('/post/:id', postsControllers.deletePostByID);

module.exports = router;

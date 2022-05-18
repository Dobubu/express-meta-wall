var express = require('express');
var router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const postsControllers = require('../controllers/posts');

router.get('/posts', postsControllers.fetchPostList);

router.post('/post', handleErrorAsync(postsControllers.createPost));

router.patch('/post/:id', handleErrorAsync(postsControllers.updatePostByID));

router.delete('/posts', postsControllers.deletePost);

router.delete('/post/:id', handleErrorAsync(postsControllers.deletePostByID));

module.exports = router;

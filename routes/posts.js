var express = require('express');
var router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const postsControllers = require('../controllers/posts');
const { isAuth } = require('../middleware/auth');

router.get('/posts', isAuth, postsControllers.fetchPostList);

router.get('/post/:id', isAuth, postsControllers.fetchPostInfo);

router.get('/posts/user/:id', isAuth, postsControllers.fetchUserPostList);

router.post('/post', isAuth, handleErrorAsync(postsControllers.createPost));

router.patch('/post/:id', isAuth, handleErrorAsync(postsControllers.updatePostByID));

router.post('/post/:id/like', isAuth, handleErrorAsync(postsControllers.addLike));

router.delete('/post/:id/like', isAuth, handleErrorAsync(postsControllers.deleteLike));

router.delete('/posts', isAuth, postsControllers.deletePost);

router.delete('/post/:id', isAuth, handleErrorAsync(postsControllers.deletePostByID));

module.exports = router;

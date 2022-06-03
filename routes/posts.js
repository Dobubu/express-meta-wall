var express = require('express');
var router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const postsControllers = require('../controllers/posts');
const { isAuth } = require('../middleware/auth');

router.get('/posts', isAuth, postsControllers.fetchPostList);

router.get('/post/:id', isAuth, postsControllers.fetchPostInfo);

router.get('/posts/user/:id', isAuth, postsControllers.fetchUserPostList);

router.post('/post', isAuth, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'Create post'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
    * #swagger.parameters['obj] = {
      in: 'body',
      required: true,
      description: 'Create post',
      schema: {
        $name: 'abc',
        image: '',
        $content: 'hello',
        $type: 'group',
        $tags: ['node', 'f2e'],
      }
    }
   */

  postsControllers.createPost(req, res, next);
}));

router.patch('/post/:id', isAuth, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'Update post by Id'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
    * #swagger.parameters['obj] = {
      in: 'body',
      description: 'Update post',
      required: true,
      schema: {
        $content: 'hello222',
      }
    }
   */

  postsControllers.updatePostByID(req, res, next);
}));

router.post('/post/:id/like', isAuth, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'Add post like by Id'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */
  
  postsControllers.addLike(req, res, next);
}));

router.delete('/post/:id/like', isAuth, handleErrorAsync(async(req, res, next) => {
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'Delete post like by Id'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  postsControllers.deleteLike(req, res, next);
}));

router.delete('/posts', isAuth, postsControllers.deletePosts);

router.delete('/post/:id', isAuth, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'Delete post by Id'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  postsControllers.deletePostByID(req, res, next);
}));

router.post('/post/:id/comment', isAuth, handleErrorAsync(async (req, res, next) => {
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'Add post comment by Id'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   */

  postsControllers.addComment(req, res, next);
}));

module.exports = router;

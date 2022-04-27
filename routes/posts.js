var express = require('express');
var router = express.Router();

const postsControllers = require('../controllers/posts');

router.get('/', (req, res, next) => {
  postsControllers.fetchPostList(res);
});

router.post('/', (req, res, next) => {
  const { body } = req;

  postsControllers.createPost({ body, res });
});

router.patch('/:id', (req, res, next) => {
  const { body } = req;

  postsControllers.updatePostByID({ req, res, body })
});

router.delete('/', (req, res, next) => {
  postsControllers.deletePost(res);
});

router.delete('/:id', (req, res, next) => {
  postsControllers.deletePostByID({ req, res });
});

module.exports = router;

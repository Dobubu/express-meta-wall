var express = require('express');
var router = express.Router();

const postsControllers = require('../controllers/posts');

router.post('/', (req, res, next) => {
  const { body } = req;

  postsControllers.createPost({ body, res });
});

router.patch('/:id', (req, res, next) => {
  const { body } = req;

  postsControllers.updatePostByID({ req, res, body })
});

router.delete('/:id', (req, res, next) => {
  postsControllers.deletePostByID({ req, res });
});

module.exports = router;

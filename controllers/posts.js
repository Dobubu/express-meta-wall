const mongoose = require('mongoose');

const Post = require('../model/posts');
const User = require('../model/users');

const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const posts = {
  async fetchPostList(req, res) {
    /**
     * #swagger.tags = ['Post']
     * #swagger.summary = 'Get post list'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */

    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";
    const q = !!req.query.q ? { "content": new RegExp(req.query.q) } : {};

    // 連到的欄位（path）：post 的 user 欄位
    // 帶出的欄位（select）：name、photo
    // -  這裡是指 user collection name、photo，因為 post user ref collection name 是 user
    const data = await Post.find(q).populate({
      path: 'user',           
      select: 'name photo'
    }).sort(sort);
    handleSuccess(res, data);
  },
  async fetchUserPostList (req, res) {
    const userId = req.params.id;

    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";
    const q = !!req.query.q ? { "content": new RegExp(req.query.q) } : {};

    const data = await Post.find({ user: userId, ...q }).populate({
      path: 'user',           
      select: 'name photo _id'
    }).sort(sort);;

    handleSuccess(res, data);
  },
  async createPost(req, res, next) {
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
    const { image, content, type, tags } = req.body;
    const { id } = req.user

    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) {
      return handleError('the user id is invalid.', next);
    };

    const isExist = await User.findById(id).exec();
    if(!isExist) {
      return handleError('the user not exist.', next);
    };

    const newPost = await Post.create({
      user: id,
      image,
      content,
      type,
      tags
    });

    handleSuccess(res, newPost);
  },
  async updatePostByID(req, res, next) {
    /**
     * #swagger.tags = ['Post']
     * #swagger.summary = 'Update post by ID'
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
    const id = req.params.id;
    
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) {
      return handleError('the id is invalid.', next);
    };

    const isExist = await Post.findById(id).exec();
    if(!isExist) {
      return handleError('post not exist.', next);
    }

    const { name, content, type, tags } = req.body;

    if(!content) {
      return handleError('content field required.', next);
    }

    let payload = { content };
    if(name) {
      payload = { ...payload, name };
    };
    if(type) {
      if(type === "group" || type === "person") {
        payload = { ...payload, type };
      } else {
        return handleError('the type is invalid, valid values include [group, person].', next);
      };
    };
    if(tags) {
      if(!tags.length) {
        return handleError("tags can't empty.", next);
      }
      payload = { ...payload, tags };
    };

    const updatePostRes = await Post.findByIdAndUpdate(id, payload, { new: true });

    handleSuccess(res, updatePostRes);
  },
  async addLike(req, res) {
    const id = req.params.id;

    await Post.findOneAndUpdate(
      { _id: id },
      { $addToSet: { likes: req.user.id } }
    );

    const addLikeRes = {
      postId: id,
      userId: req.user.id
    };

    handleSuccess(res, addLikeRes, 201);
  },
  async deleteLike(req, res) {
    const id = req.params.id;

    await Post.findOneAndUpdate(
      { _id: id },
      { $pull: { likes: req.user.id } }
    );

    const deleteLikeRes = {
      postId: id,
      userId: req.user.id
    };

    handleSuccess(res, deleteLikeRes, 201);
  },
  async deletePost(req, res) {
    /**
     * #swagger.tags = ['Post']
     * #swagger.summary = 'Delete posts'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    await Post.deleteMany({});

    handleSuccess(res, []);
  },
  async deletePostByID(req, res, next) {
    /**
     * #swagger.tags = ['Post']
     * #swagger.summary = 'Delete post by ID'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    const id = req.params.id;

    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) {
      return handleError('the id is invalid.', next);
    };
    
    const isExist = await Post.findById(id).exec();
    if(!isExist) {
      return handleError('post not exist.', next);
    };

    await Post.findByIdAndDelete(id);

    handleSuccess(res, 'delete success');
  }
};

module.exports = posts;
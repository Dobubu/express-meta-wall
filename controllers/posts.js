const Posts = require('../model/posts');

const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const posts = {
  async fetchPostList(req, res) {
    /**
     * #swagger.tags = ['Posts']
     * #swagger.summary = 'Get post list'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    const data = await Posts.find();
    handleSuccess(res, data);
  },
  async createPost(req, res) {
    /**
     * #swagger.tags = ['Posts']
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
    try {
      const { name, image, content, type, tags } = req.body;

      const newPost = await Posts.create({
        name,
        image,
        content,
        type,
        tags
      });

      handleSuccess(res, newPost);
    } catch (e) {
      handleError(res, e);
    };
  },
  async findDB() {
    return await Posts.find();
  },
  async updatePostByID(req, res) {
    /**
     * #swagger.tags = ['Posts']
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
    try {
      const id = req.params.id;
      const isExist = await Posts.findById(id).exec();
      if(!isExist) throw new Error('post not exist.');

      const { name, content, type, tags } = req.body;

      if(!content) throw new Error('content field required.');

      let payload = { content };
      if(name) {
        payload = { ...payload, name };
      };
      if(type) {
        if(type === "group" || type === "person") {
          payload = { ...payload, type };
        } else {
          throw new Error('type is invalid, valid values include [group, person].');
        };
      };
      if(tags) {
        if(!tags.length) throw new Error("tags can't empty.");
        payload = { ...payload, tags };
      };

      const updatePostRes = await Posts.findByIdAndUpdate(id, payload, { new: true });

      handleSuccess(res, updatePostRes);
    } catch (e) {
      handleError(res, e);
    };
  },
  async deletePost(req, res) {
    /**
     * #swagger.tags = ['Posts']
     * #swagger.summary = 'Delete posts'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    await Posts.deleteMany({});

    handleSuccess(res, []);
  },
  async deletePostByID(req, res) {
    /**
     * #swagger.tags = ['Posts']
     * #swagger.summary = 'Delete post by ID'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    try {
      const id = req.params.id;
      const isExist = await Posts.findById(id).exec();
      if(!isExist) throw new Error('post not exist.');

      await Posts.findByIdAndDelete(id);

      handleSuccess(res, 'delete success');
    } catch (e) {
      handleError(res, e);
    };
  }
};

module.exports = posts;
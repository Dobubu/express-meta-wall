const Posts = require('../model/posts');

const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const posts = {
  async fetchPostList(res) {
    const data = await Posts.find();

    handleSuccess(res, data);
  },
  async createPost({ body, res }) {
    try {
      const { name, image, content, type, tags } = body;

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
  async updatePostByID({ req, res, body }) {
    try {
      const id = req.params.id;
      const isExist = await Posts.findById(id).exec();
      if(!isExist) throw new Error('post not exist.');

      const { name, content, type, tags } = body;

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
  async deletePost(res) {
    await Posts.deleteMany({});

    handleSuccess(res, []);
  },
  async deletePostByID({ req, res }) {
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
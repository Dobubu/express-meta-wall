const Posts = require('../model/posts');

const posts = {
  async fetchPostList(res) {
    const data = await Posts.find();

    res.status(200).json({
      'status': 'success',
      data
    });
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

      res.status(200).json({
        'status': 'success',
        data: newPost
      });
    } catch (e) {
      const errorMsg = e.message || 'parse error.';

      res.status(400).json({
        'status': 'false',
        'message': errorMsg
      });
    };
  },
  async findDB() {
    return await Posts.find();
  },
  async updatePostByID({ req, res, body }) {
    try {
      const id = req.params.id;
      const list = await posts.findDB();
      const isExist = list.find(o => o.id === id);
      if(!isExist) throw new Error('post not exist.')

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

      res.status(200).json({
        'status': 'success',
        data: updatePostRes
      });
    } catch (e) {
      const errorMsg = e.message || 'parse error.';

      res.status(400).json({
        'status': 'false',
        'message': errorMsg
      });
    }
  },
  async deletePost(res) {
    await Posts.deleteMany({});

    res.status(200).json({
      'status': 'success',
      data: []
    });
  },
  async deletePostByID({ req, res }) {
    try {
      const id = req.params.id;
      const list = await posts.findDB();
      const isExist = list.find(o => o.id === id);
      if(!isExist) throw new Error('post not exist.')

      await Posts.findByIdAndDelete(id);

      res.status(200).json({
        'status': 'success',
        'message': 'delete success'
      });
    } catch (e) {
      const errorMsg = e.message || 'parse error.';

      res.status(400).json({
        'status': 'false',
        'message': errorMsg
      });
    };
  }
};

module.exports = posts;
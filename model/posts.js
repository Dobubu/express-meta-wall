const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",  // mongoose.model name。這邊是要 user 這個 model
      required: [true, 'user ID field required']
    },
    image: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'content field required']
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum:['group', 'person'],
      required: [true, 'type field required']
    },
    tags: {
      type: [String],
      required: [true, 'tags field required']
    }
  },
  {
    versionKey: false,
  }
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
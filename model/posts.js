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
    likes: [
      {
        type: mongoose.Schema.ObjectId, 
        ref: "User"
      }
    ],
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
    toJSON: { virtuals: true },   // 注意：有使用 virtual 要加
    toObject: { virtuals: true }, // 注意：有使用 virtual 要加
  }
);

// .virtual()，偷掛一個 comments 到 post document 上去
PostSchema.virtual('comments', {
  ref: 'Comment',         // mongoose.model name。這邊是指要拉 Comment 這個 model
  foreignField: 'post',   // 查 Comment 的 post 欄位
  localField: '_id'       // 用 _id，找出 post 欄位（foreignField）裡面有沒有一樣的 id
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
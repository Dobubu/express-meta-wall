const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'comment field required']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",  // mongoose.model name。這邊是要 user 這個 model
      required: [true, 'user must belong to a post']
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'post',
      require: [true, 'post must belong to a post']
    }
  },
  {
    versionKey: false,
  }
);

// .pre()：使用 CommentsSchema 前先做些處理。當有使用包含 find 就會觸發
CommentsSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user', // 針對 CommentsSchema 的 user 欄位
    select: 'name id photo createdAt' // 抓出指定的欄位
  });

  next();
});

const Comment = mongoose.model('Comment', CommentsSchema);

module.exports = Comment;
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name field required']
    },
    photo: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",  // mongoose.model name。這邊是要 user 這個 model
      required: [true, 'user ID field required']
    },
    user_type: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: [true, 'content field required']
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    versionKey: false,
    // timestamps: true
  }
);

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
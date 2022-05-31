const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name field required']
    },
    email: {
      type: String,
      required: [true, 'email field required'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: String,
    sex: {
      type: String,
      enum:['male', 'female'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    password: {
      type: String,
      required: [true, 'enter your password'],
      minLength: 8,
      select: false,
    },
    followers: [
      {
        user: { 
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    following: [
      {
        user: { 
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model('user', UserSchema);

module.exports = User;
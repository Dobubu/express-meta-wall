const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../model/users');
const Post = require('../model/posts');

const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');
const { generateSendJWT } = require('../service/token');

const users = {
  async fetchUsers(req, res) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'Get user list.'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    const data = await User.find();
    handleSuccess(res, data);
  },
  async deleteUsers(req, res) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'Delete users'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    await User.deleteMany({});

    handleSuccess(res, []);
  },
  async signUp(req, res, next) {
    const data = await User.find().select('+email');;
    const { name, email, password } = req.body;

    const isDuplicate = data.find(o => o.email === email);
    if(isDuplicate) {
      return handleError('該信箱已被註冊！', next);
    }

    if (!name || !email || !password) {
      return handleError('上述欄位不可為空！', next);
    };

    if (!validator.isLength(name, { min: 2 })) {
      return handleError('暱稱至少 2 個字元以上！', next);
    };

    if (!validator.isEmail(email)) {
      return handleError('Email 格式不正確！', next);
    };
    
    if (!validator.isLength(password, { min: 8 })) {
      return handleError('密碼字數低於 8 碼！', next);
    };

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    generateSendJWT(newUser, res, 201);
  },
  async signIn(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleError('帳號密碼不可為空！', next);
    };

    if (!validator.isEmail(email)) {
      return handleError('Email 格式不正確！', next);
    };

    if (!validator.isLength(password, { min: 8 })) {
      return handleError('密碼字數低於 8 碼！', next);
    };

    const user = await User.findOne({ email }).select('+password');
    if(!user){
      return handleError('查無使用者！', next);
    };

    const auth = await bcrypt.compare(password, user.password);
    if(!auth){
      return handleError('您的密碼不正確！', next);
    };

    generateSendJWT(user, res);
  },
  async fetchProfile(req, res) {
    handleSuccess(res, req.existUser);
  },
  async updateProfile(req, res, next) {
    const { name, photo, sex } = req.body;
    
    if(!name) {
      return handleError('暱稱不可為空！', next);
    };
  
    const isSex = ['male', 'female'].find(o => o === sex);
    if((!isSex && sex) || sex === '') {
      return handleError('性別資料有誤！', next);
    };

    if(photo && photo === '') {
      return handleError('照片不可為空！', next);
    };

    const payload = { 
      name,
      photo,
      sex
    };

    const updateUser = await User.findByIdAndUpdate(req.user.id, payload, { new: true });

    handleSuccess(res, updateUser);
  },
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return handleError('上述欄位不可為空！', next);
    };

    if (password !== confirmPassword) {
      return handleError('密碼不一致！', next);
    };

    if (!validator.isLength(password, { min: 8 }) || !validator.isLength(confirmPassword, { min: 8 })) {
      return handleError('密碼字數低於 8 碼！', next);
    };

    const newPassword = await bcrypt.hash(password, 12);

    const payload = { 
      password: newPassword
    };

    const updateUser = await User.findByIdAndUpdate(req.user.id, payload, { new: true });

    generateSendJWT(updateUser, res);
  },
  async fetchLikesList(req, res) {
    const id = req.user.id;

    const list = await Post.find({
      likes: { $in: [id] }
    }).populate({
      path: "user",
      select: "name _id photo"
    });

    handleSuccess(res, list);
  },
  async followUser(req, res, next) {
    const followUserId = req.params.id;
    const userId = req.user.id;

    if (followUserId === userId) {
      return handleError('您無法追蹤自己！', next, 401);
    };

    // 針對自己
    await User.updateOne(
      {
        _id: userId,
      },
      {
        $addToSet: { following: { user: followUserId } }
      }
    );

    // 針對對方
    await User.updateOne(
      {
        _id: followUserId,
      },
      {
        $addToSet: { followers: { user: userId } }
      }
    );

    handleSuccess(res, '您已成功追蹤！');
  },
  async unFollowUser(req, res, next) {
    const unFollowUserId = req.params.id;
    const userId = req.user.id;

    if (unFollowUserId === userId) {
      return handleError('您無法取消追蹤自己', next, 401);
    };

    // 針對自己
    await User.updateOne(
      {
        _id: userId,
      },
      {
        $pull: { following: { user: unFollowUserId } }
      }
    );

    // 針對對方
    await User.updateOne(
      {
        _id: unFollowUserId,
      },
      {
        $pull: { followers: { user: userId } }
      }
    );

    handleSuccess(res, '您已成功取消追蹤！');
  },
  async fetchFollowingList(req, res) {
    const id = req.user.id;

    const isExist = await User.findById(id).populate({
      path: 'following',
      populate: {
        path: 'user',
        model: 'user',
        select: 'name photo'
      }
    }).exec();
    if(!isExist) {
      return handleError('user not exist.', next);
    };

    const followingListRes = isExist.following;

    handleSuccess(res, followingListRes);
  },
};

module.exports = users;
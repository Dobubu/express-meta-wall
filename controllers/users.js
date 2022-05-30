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
     * #swagger.summary = 'fetch user list.'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    const data = await User.find();
    handleSuccess(res, data);
  },
  async signUp(req, res, next) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'sign up'
     */
    const data = await User.find().select('+email');;
    const { name, email, password } = req.body;

    const isDuplicate = data.find(o => o.email === email);
    if(isDuplicate) {
      return handleError('該信箱已被註冊！', next);
    }

    if (!name || !email || !password) {
      return handleError('上述欄位不可為空！', next);
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
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'sign in'
     */
    const { email, password } = req.body;

    if (!email || !password) {
      return handleError('帳號密碼不可為空！', next);
    };

    const user = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);

    if(!auth){
      return handleError('您的密碼不正確！', next);
    };

    generateSendJWT(user, res);
  },
  async fetchProfile(req, res) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'fetch profile'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    const id = req.params.id;

    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) {
      return handleError('the id is invalid.', next);
    };

    const isExist = await User.findById(id).exec();
    if(!isExist) {
      return handleError('user not exist.', next);
    };

    handleSuccess(res, isExist);
  },
  async updateProfile(req, res, next) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'update profile'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
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
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'update password'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
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
    const list = await Post.find({
      likes: { $in: [req.user.id] }
    }).populate({
      path: "user",
      select: "name _id photo"
    });

    handleSuccess(res, list);
  }
};

module.exports = users;
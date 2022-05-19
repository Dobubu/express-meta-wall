const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../model/users');

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
  }
};

module.exports = users;
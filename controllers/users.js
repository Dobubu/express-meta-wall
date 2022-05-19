const User = require('../model/users');

const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

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
};

module.exports = users;
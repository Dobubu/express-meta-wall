const mongoose = require('mongoose');

const Chat = require('../model/chat');

const handleSuccess = require('../service/handleSuccess');

const chats = {
  async fetchMessageList(req, res) {
    /**
     * #swagger.tags = ['Chat']
     * #swagger.summary = 'Get message list'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */

    const data = await Chat.find();

    handleSuccess(res, data);
  },
  async addMessage(payload) {
    const { name, user, photo, user_type, content } = payload;

    await Chat.create({
      name,
      user,
      photo,
      user_type,
      content
    });
  },
  async deleteMessages(req, res) {
    /**
     * #swagger.tags = ['Chat']
     * #swagger.summary = 'Delete chats'
     * #swagger.security = [{
        "apiKeyAuth": []
      }]
     */
    await Chat.deleteMany({});

    handleSuccess(res, []);
  },
};

module.exports = chats;
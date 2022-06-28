const mongoose = require('mongoose');
const dayjs = require('dayjs');

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

    await chats.clearMessages();

    const data = await Chat.find();

    handleSuccess(res, data);
  },
  async addMessage(payload) {
    const { name, user, photo, user_type, content } = payload;

    const newMessage = await Chat.create({
      name,
      user,
      photo,
      user_type,
      content
    });

    return newMessage;
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
  async clearMessages() {
    // const a = dayjs().subtract(1, 'day').format('YYYY/MM/DD');
    // const b = dayjs().format('YYYY/MM/DD');

    const data1 = await Chat.find();

    // const data2 = await Chat.find({
    //   "createdAt": {
    //     $gte: new Date(a),
    //     $lt: new Date(b)
    //   }
    // });

    // if(data2.length !== data1.length) {
    //   await Chat.deleteMany({});
    // }

    if(data1.length) {
      const historyDate = dayjs(data1[0].createdAt).format('YYYY-MM-DD');
      const isSameDate = dayjs().isSame(historyDate, 'day');
  
      if(!isSameDate) {
        await Chat.deleteMany({});
      };
    };
  }
};

module.exports = chats;
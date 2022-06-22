const { Server } = require("socket.io");

const chatControllers = require('../controllers/chat');

let io;
const SYSTEM = 'system';
const USER = 'user';

const getSocketIO = () => io;

const connection = () => {
  io.on('connection', socket => {
    console.log('socket connection', socket.id);

    socket.on('post:create', payload => {
      const { userId, content } = payload;

      io.emit('post:list', content);

      // socket.broadcast.emit('post:list', content);
    });

    let userTypeBack;

    socket.on('chat:init', async payload => {
      const { name, user, photo } = payload;

      if(!userTypeBack) {
        userTypeBack = USER;

        const msgPayload = {
          name,
          user,
          photo,
          user_type: SYSTEM,
          content: `${name} 加入了聊天大廳！`,
        };

        const newMessage = await chatControllers.addMessage(msgPayload);
        socket.broadcast.emit('chat:message', newMessage);
      };
    });

    socket.on('chat:message', async payload => {
      const { name, user, photo, content } = payload;

      const msgPayload = {
        name,
        user,
        photo,
        user_type: userTypeBack,
        content,
      };
      
      const newMessage = await chatControllers.addMessage(msgPayload);
      io.emit('chat:message', newMessage);
    });

    socket.on('chat:message:bak', async payload => {
      const { name, user, photo, content } = payload;
      let msgPayload;

      if(userTypeBack) {
        msgPayload = {
          name,
          user,
          photo,
          user_type: userTypeBack,
          content,
        };
        
        const newMessage = await chatControllers.addMessage(msgPayload);
        io.emit('chat:message', newMessage);
      } else {
        userTypeBack = USER;

        msgPayload = {
          name,
          user,
          photo,
          user_type: SYSTEM,
          content: `${name} 加入了聊天大廳！`,
        };

        const newMessage = await chatControllers.addMessage(msgPayload);
        socket.broadcast.emit('chat:message', newMessage);
      };
    });

    socket.on('chat:disconnect', async payload => {
      const { name, user, photo } = payload;

      const msgPayload = {
        name,
        user,
        photo,
        user_type: SYSTEM,
        content: `${name} 離開了聊天大廳！Bye ~`,
      };

      const newMessage = await chatControllers.addMessage(msgPayload);
      userTypeBack = '';
      io.emit('chat:message', newMessage);
    });
    
    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
  });
};

const corsOriginBase =
  process.env.NODE_ENV === 'dev'
    ? 'http://localhost:3002'
    : 'https://dobubu.github.io/meta-wall-web/#/';

const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: corsOriginBase
    }
  });

  connection();
};

module.exports = {
  getSocketIO,
  init
};

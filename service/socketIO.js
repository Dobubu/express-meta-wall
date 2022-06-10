const { Server } = require("socket.io");

let io;

const getSocketIO = () => io;

const connection = () => {
  io.on('connection', socket => {
    console.log('socket connection', socket.id);

    socket.on('post:create', payload => {
      const { userId, content } = payload;

      io.emit('post:list', content);

      // socket.broadcast.emit('post:list', content);
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

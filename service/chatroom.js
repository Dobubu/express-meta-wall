const WebSocket = require('ws');

const chatControllers = require('../controllers/chat');

let wss;

const getWebSocket = () => wss;

const connection = () => {
  wss.on('connection', function connection(ws) {
    console.log('wss:client connection')

    ws.on('message', async function incoming(data) {
      const msg = JSON.parse(data.toString());
      let payload;

      if(msg.cmd === "WEB_Init") {
        const { name, photo, user, content} = msg;
        payload = {
          name,
          photo,
          user,
          role: 'system',
          cmd: 'APP_Init_Response',
          content,
        };

        const newMessage = await chatControllers.addMessage(payload);
        console.log('create db message:WEB_Init', newMessage);
      }

      if(msg.cmd === "WEB_User_Leave") {
        const { name, photo, user, content} = msg;
        payload = {
          name,
          photo,
          user,
          role: 'system',
          cmd: 'APP_User_Leave_Response',
          content,
        };

        const newMessage = await chatControllers.addMessage(payload);
        console.log('create db message:WEB_User_Leave', newMessage);
      }

      if(msg.cmd === "WEB_Add_Message") {
        const { name, photo, user, content} = msg;
        payload = {
          name,
          photo,
          user,
          role: 'user',
          cmd: 'APP_Add_Message_Response',
          content,
        };

        const newMessage = await chatControllers.addMessage(payload);
        console.log('create db message:WEB_Add_Message', newMessage);
      }

      if(msg.cmd === "WEB_Typing") {
        const { name, content } = msg;
        payload = {
          role: 'system',
          name,
          content,
          cmd: 'APP_Typing_Response'
        };
      }
      
      let clients = wss.clients
      clients.forEach(client => {
        client.send(JSON.stringify(payload))
      })
      
      console.log('msg: ', msg);
      // ws.send(data.toString());
    })

    ws.on('close', () => {
      console.log('wss:client disconnected')
    })
  })
};

const init = (server) => {
  wss = new WebSocket.Server({ server })

  connection();
};

module.exports = {
  getWebSocket,
  init
};
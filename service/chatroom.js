const WebSocket = require('ws');

let wss;

const getWebSocket = () => wss;

const connection = () => {
  wss.on('connection', function connection(ws) {
    console.log('wss:client connection')

    ws.on('message', function incoming(data) {
      const msg = data.toString();
      console.log('msg: ', msg);
      ws.send(msg);
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
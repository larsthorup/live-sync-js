'use strict';

let WebSocket = require('ws');

// ToDo: extend common ConnectionBase base clase
class SocketConnection {
  constructor (socket) {
    Object.assign(this, {socket});
  }

  static connectingUpstream (upstreamConnectionString) {
    return new Promise((resolve, reject) => {
      let socket = new WebSocket(upstreamConnectionString);
      socket.on('open', () => {
        let connection = new SocketConnection(socket);
        resolve(connection);
      });
      socket.on('error', () => {
        reject(new Error('failed connecting to upstream: ' + upstreamConnectionString));
      });
    });
  }

  sendingCommandUpstream (cmd) {
    return new Promise((resolve) => {
      var message = {
        type: 'send-command',
        data: cmd
      };
      this.socket.send(JSON.stringify(message), () => {
        console.log('sent', cmd);
      });
    });
  }
}

module.exports = {
  SocketConnection: SocketConnection
};

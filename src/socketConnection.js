'use strict';

let WebSocket = require('ws');

// ToDo: extend common ConnectionBase base clase
class SocketConnection {
  constructor (downstreamServer, upstreamSocket) {
    Object.assign(this, {downstreamServer, upstreamSocket});
  }

  static connecting (downstreamServer, upstreamConnectionString) {
    return new Promise((resolve, reject) => {
      let upstreamSocket = new WebSocket(upstreamConnectionString);
      upstreamSocket.on('open', () => {
        let connection = new SocketConnection(downstreamServer, upstreamSocket);
        downstreamServer.connectingUpstream(connection).then(() => {
          resolve(connection);
        });
      });
      upstreamSocket.on('error', () => {
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
      this.upstreamSocket.send(JSON.stringify(message), () => {
        console.log('sent', cmd);
      });
    });
  }
}

module.exports = {
  SocketConnection: SocketConnection
};

'use strict';

let ws = require('ws');

// ToDo: extend common ConnectionBase base clase
class SocketConnection {
  constructor (downstreamServer, upstreamSocket) {
    Object.assign(this, {downstreamServer, upstreamSocket});
  }

  static connecting (downstreamServer, upstreamConnectionString) {
    return new Promise((resolve, reject) => {
      let upstreamSocket = new ws.WebSocket(upstreamConnectionString);
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

  sendingCommand (cmd) {
    // ToDo: send command on socket
    return Promise.resolve();
  }

  receivingCommands () {
    // ToDo: request and receive commands from upstream
    let commands = {};
    return Promise.resolve(commands);
  }
}

module.exports = {
  SocketConnection: SocketConnection
};

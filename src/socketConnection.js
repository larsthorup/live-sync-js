'use strict';

let WebSocket = require('ws');

class SocketConnection {
  constructor (options) {
    Object.assign(this, options);
    this.socket.on('message', this.onMessage.bind(this));
  }

  static connectingUpstream (options) {
    return new Promise((resolve, reject) => {
      let socket = new WebSocket(options.upstreamConnectionString);
      socket.on('open', () => {
        let connectionOptions = {
          socket,
          server: options.server,
          monitor: options.monitor
        };
        let connection = new SocketConnection(connectionOptions);
        resolve(connection);
      });
      socket.on('error', () => {
        reject(new Error('failed connecting to upstream: ' + options.upstreamConnectionString));
      });
    });
  }

  static connectingDownstream (options) {
    return Promise.resolve(new SocketConnection(options));
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

  onMessage (data) {
    var message = JSON.parse(data);
    // console.log('received', message);
    switch (message.type) {
      case 'send-command':
        let cmd = message.data;
        this.server.receiving(cmd).then(wasProcessed => {
          if (wasProcessed) {
            return this.monitor.logging({
              name: this.server.name,
              action: 'command',
              from: cmd.originator
            }).then(() => {
              return this.server.repo.gettingRankSum();
            }).then(rankSum => {
              console.log('rank sum now:', rankSum);
            });
          }
        }).catch(err => {
          console.log(err);
        });
        break;
    }
  }
}

module.exports = {
  SocketConnection: SocketConnection
};

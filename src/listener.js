'use strict';

let restify = require('restify');
let ws = require('ws');

let SocketConnection = require('./socketConnection').SocketConnection;

class Listener {
  constructor (options) {
    Object.assign(this, options, {
      log: console.log,
      latestClientId: 0
    });
  }

  listening () {
    return new Promise((resolve, reject) => {
      let server = restify.createServer({
        name: this.name
      });

      this.socketServer = new ws.Server({
        server: server.server
      });
      this.socketServer.on('connection', this.onConnect.bind(this));

      this.socketClosing = new Promise((resolve) => {
        server.on('close', () => {
          this.log(`${server.name} closing down`);
          resolve();
        });
      });

      server.listen(this.port, () => {
        this.log(`${server.name} listening at ${server.url}`);
        resolve();
      });
    });
  }

  closing () {
    return this.socketClosing;
  }

  onConnect (socket) {
    let clientId = ++this.latestClientId;
    socket.clientId = clientId;
    this.log(`connection from downstream ${clientId} established`);
    socket.on('close', function (code, message) {
      console.log(`connection from downstream ${this.clientId} closed`);
      // ToDo: this.server.disconnectDownstream(connection);
    });
    socket.on('message', this.onMessage.bind(this));
    SocketConnection.connectingDownstream(socket).then(connection => {
      return this.server.connectingDownstream(connection);
    });
  }

  onMessage (data) {
    var message = JSON.parse(data);
    // console.log('received', message);
    switch (message.type) {
      case 'send-command':
        this.server.processingFromDownstream(message.data).then(() => {
          return this.monitor.logging({name: this.server.name, action: 'command', from: message.data.originator});
        }).then(() => {
          return this.server.repo.gettingRankSum();
        }).then(rankSum => {
          console.log('rank sum now:', rankSum);
        }).catch(err => {
          console.log(err);
        });
        break;
    }
  }
}

module.exports = {
  Listener: Listener
};

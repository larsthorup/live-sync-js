'use strict';

let restify = require('restify');
let WebSocket = require('ws');

class Server {
  constructor (port) {
    Object.assign(this, {port}, {
      expectings: []
    });
  }

  listening () {
    return new Promise((resolve, reject) => {
      this.server = restify.createServer({
        name: this.name
      });

      this.socketServer = new WebSocket.Server({
        server: this.server.server
      });
      this.socketServer.on('connection', this.onConnect.bind(this));

      this.serverClosing = new Promise((resolve, reject) => {
        this.server.on('close', () => {
          resolve();
        });
      });

      this.server.listen(this.port, () => {
        resolve();
      });
    });
  }

  onConnect (connection) {
    connection.on('close', function (code, message) {
    });
    connection.on('message', this.onMessage.bind(this));
  }

  onMessage (data) {
    let message = JSON.parse(data);
    let messageString = JSON.stringify(message); // Note: use this node engine's JSON stringify
    for (let i = 0; i < this.expectings.length; ++i) {
      if (messageString === this.expectings[i].messageString) {
        let resolve = this.expectings[i].resolve;
        this.expectings.splice(i, 1);
        resolve();
        return;
      }
    }
    console.log('Monitor: ignoring message: ', message);
  }

  closing () {
    this.server.close();
    return this.serverClosing;
  }

  expecting (message) {
    return new Promise((resolve) => {
      this.expectings.push({messageString: JSON.stringify(message), resolve});
    });
  }
}

module.exports = {
  Server: Server
};

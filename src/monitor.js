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

class Client {
  constructor (connectionString) {
    Object.assign(this, {connectionString});
  }

  connecting () {
    if (this.connectionString) {
      return new Promise((resolve, reject) => {
        this.socket = new WebSocket(this.connectionString);
        this.socket.on('open', () => {
          resolve();
        });
        this.socket.on('error', () => {
          reject(new Error('failed connecting to monitor: ' + this.connectionString));
        });
      });
    } else {
      return Promise.resolve();
    }
  }

  disconnect () {
    this.socket.close();
  }

  logging (message) {
    if (this.socket) {
      return new Promise((resolve) => {
        let data = JSON.stringify(message);
        this.socket.send(data, () => {
          resolve();
        });
      });
    } else {
      return Promise.resolve();
    }
  }
}

module.exports = {
  Server: Server,
  Client: Client
};

'use strict';

let restify = require('restify');
let WebSocket = require('ws');

class Server {
  constructor (port) {
    Object.assign(this, {port});
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
          // console.log('Monitor: stopped');
          resolve();
        });
      });

      this.server.listen(this.port, () => {
        // console.log('Monitor: started');
        resolve();
      });
    });
  }

  onConnect (connection) {
    // console.log('Monitor: connection established');
    connection.on('close', function (code, message) {
      // console.log('Monitor: connection closed');
    });
    connection.on('message', this.onMessage.bind(this));
  }

  onMessage (data) {
    // console.log('Monitor: message received', data);
    // var message = JSON.parse(data);
    // ToDo: add to channel
  }

  closing () {
    this.server.close();
    return this.serverClosing;
  }

  logging (expectedMessage) {
    // ToDo: pull from channel
    return new Promise((resolve) => {
      // console.log('logging');
      setTimeout(() => {
        // console.log('resolve');
        resolve();
      }, 1000);
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
          // console.log('arguments', arguments);
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

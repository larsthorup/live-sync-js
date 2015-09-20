'use strict';

let WebSocket = require('ws');

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
  Client: Client
};

'use strict';

var Server = require('./server').Server;

class Client {
  constructor (name) {
    this.server = new Server(name);
  }

  creatingRank (statement, rank) {
    return Promise.resolve();
  }
}

module.exports = {
  Client: Client
};

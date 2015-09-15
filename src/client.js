'use strict';

var Server = require('./server').Server;

class Client {
  constructor (name) {
    this.server = new Server(name);
  }

  creatingRank (statement, rank) {
    var command = {
      command: 'add',
      domain: 'rank',
      objectType: 'statement',
      object: statement,
      value: rank
    };
    return this.server.processing(command);
  }
}

module.exports = {
  Client: Client
};

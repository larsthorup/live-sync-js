'use strict';

var Server = require('./server').Server;

class Client {
  constructor (name) {
    Object.assign(this, {
      id: name,
      server: new Server(name)
    });
  }

  creatingRank (statement, rank) {
    var command = this.server.repo.makeAddRankCommand({
      originator: this.id,
      object: statement,
      value: rank
    });
    return this.server.processingFromDownstream(command);
  }
}

module.exports = {
  Client: Client
};

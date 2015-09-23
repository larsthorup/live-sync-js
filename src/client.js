'use strict';

let Server = require('./server').Server;

class Client {
  constructor (name) {
    Object.assign(this, {
      id: name,
      server: new Server(name)
    });
  }

  creatingRank (statement, rank) {
    let command = this.server.repo.makeAddRankCommand({
      originator: this.id,
      object: statement,
      value: rank
    });
    return this.server.receiving(command);
  }
}

module.exports = {
  Client: Client
};

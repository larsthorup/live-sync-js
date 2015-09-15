'use strict';

var Repo = require('./repo').Repo;

class Server {
  constructor (name) {
    this.repo = new Repo();
  }

  connectingUpstream (server) {
    return Promise.resolve(); // ToDo: don't fake it
  }

  synchronizingUpstream (server) {
    return Promise.resolve(); // ToDo: don't fake it
  }

  processing (command) {
    return this.repo.processing(command);
  }

}

module.exports = {
  Server: Server
};

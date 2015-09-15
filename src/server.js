'use strict';

var Repo = require('./repo').Repo;

class Server {
  constructor (name) {
    Object.assign(this, {
      repo: new Repo(),
      commandsForUpstream: []
    });
  }

  connectingUpstream (server) {
    this.upstreamServer = server;
    return Promise.resolve();
  }

  synchronizingUpstream (server) {
    var sending;
    if (this.upstreamServer) {
      var commandsForUpstream = this.commandsForUpstream;
      this.commandsForUpstream = [];
      sending = commandsForUpstream.map(cmd => this.upstreamServer.processingFromDownstream(cmd));
    } else {
      sending = [];
    }
    // ToDo: receive relevant new commands from upstream and process them
    var receiving = [];
    return Promise.all(sending.concat(receiving));
  }

  processingFromDownstream (command) {
    this.commandsForUpstream.push(command);
    return this.processing(command);
  }

  processingFromUpstream (command) {
    return this.processing(command);
  }

  processing (command) {
    return this.repo.processing(command);
  }
}

module.exports = {
  Server: Server
};

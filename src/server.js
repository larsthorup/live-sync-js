'use strict';

var Repo = require('./repo').Repo;

class Server {
  constructor (name) {
    this.repo = new Repo();
    this.commandsForUpstream = [];
  }

  connectingUpstream (server) {
    // ToDo: use injected (websocket or stub) protocol instead of a direct reference
    this.upstreamServer = server;
    return Promise.resolve();
  }

  synchronizingUpstream (server) {
    var sending;
    if (this.upstreamServer) {
      var commandsForUpstream = this.commandsForUpstream;
      this.commandsForUpstream = [];
      sending = commandsForUpstream.map(cmd => this.upstreamServer.processing(cmd));
    } else {
      sending = [];
    }
    // ToDo: receive new commands from upstream and process them
    var receiving = [];
    return Promise.all(sending.concat(receiving));
  }

  processing (command) {
    this.commandsForUpstream.push(command);
    return this.repo.processing(command);
  }

}

module.exports = {
  Server: Server
};

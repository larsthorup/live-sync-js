'use strict';

let Repo = require('./repo').Repo;

class Server {
  constructor (name) {
    Object.assign(this, {
      repo: new Repo(),
      processedCommands: {}
    });
  }

  connectingUpstream (server) {
    this.upstreamServer = server;
    return Promise.resolve();
  }

  synchronizingUpstream (server) {
    let sending = [];
    if (this.upstreamServer) {
      // ToDo: optimization: only send new commands
      for (let cmdId in this.processedCommands) {
        let cmd = this.processedCommands[cmdId];
        sending.push(this.upstreamServer.processingFromDownstream(cmd));
      }
    }
    // ToDo: receive relevant new commands from upstream and process them
    let receiving = [];
    if (this.upstreamServer) {
      // ToDo: optimization: only retrieve new commands
      let upstreamCommands = this.upstreamServer.processedCommands;
      for (let cmdId in upstreamCommands) {
        let cmd = upstreamCommands[cmdId];
        receiving.push(this.processingFromUpstream(cmd));
      }
    }
    return Promise.all(sending.concat(receiving));
  }

  processingFromDownstream (command) {
    if (!this.processedCommands[command.id]) {
      return this.processing(command);
    } else {
      return Promise.resolve();
    }
  }

  processingFromUpstream (command) {
    if (!this.processedCommands[command.id]) {
      return this.processing(command);
    } else {
      return Promise.resolve();
    }
  }

  processing (command) {
    this.processedCommands[command.id] = command;
    return this.repo.processing(command);
  }
}

module.exports = {
  Server: Server
};

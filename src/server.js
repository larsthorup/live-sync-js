'use strict';

let Repo = require('./repo').Repo;

class Server {
  constructor (name) {
    Object.assign(this, {
      name,
      repo: new Repo(),
      processedCommands: {}
    });
  }

  connectingUpstream (connection) {
    this.upstreamConnection = connection;
    return Promise.resolve();
  }

  synchronizingUpstream (server) {
    if (this.upstreamConnection) {
      return this.upstreamConnection.receivingCommands().then(upstreamCommands => {
        let sending = [];
        let receiving = [];
        for (let cmdId in this.processedCommands) {
          let cmd = this.processedCommands[cmdId];
          sending.push(this.upstreamConnection.sendingCommand(cmd));
        }
        for (let cmdId in upstreamCommands) {
          let cmd = upstreamCommands[cmdId];
          receiving.push(this.processingFromUpstream(cmd));
        }
        return Promise.all(sending.concat(receiving));
      });
    } else {
      return Promise.resolve();
    }
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

'use strict';

let Repo = require('./repo').Repo;

class Server {
  constructor (name) {
    Object.assign(this, {
      name,
      repo: new Repo(),
      processedCommands: {},
      downstreamConnections: []
    });
  }

  connectingUpstream (connection) {
    this.upstreamConnection = connection;
    return Promise.resolve();
  }

  connectingDownstream (connection) {
    this.downstreamConnections.push(connection);
  }

  synchronizing (server) {
    if (this.upstreamConnection) {
      let sending = [];
      for (let cmdId in this.processedCommands) {
        let cmd = this.processedCommands[cmdId];
        sending.push(this.upstreamConnection.sendingCommand(cmd));
      }
      return Promise.all(sending);
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

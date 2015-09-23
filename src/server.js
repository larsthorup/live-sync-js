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
    let sending = [];
    for (let cmdId in this.processedCommands) {
      let cmd = this.processedCommands[cmdId];
      if (this.upstreamConnection) {
        sending.push(this.upstreamConnection.sendingCommandUpstream(cmd));
      }
      this.downstreamConnections.forEach(downstreamConnection => {
        sending.push(downstreamConnection.sendingCommandDownstream(cmd));
      });
    }
    return Promise.all(sending);
  }

  receiving (command) {
    if (!this.hasSeen(command)) {
      return this.processing(command);
    } else {
      return Promise.resolve();
    }
  }

  hasSeen (command) {
    return !!this.processedCommands[command.id];
  }

  processing (command) {
    if (!this.hasSeen(command)) {
      this.processedCommands[command.id] = command;
      return this.repo.processing(command);
    } else {
      return Promise.reject('processing() called with already-seen command');
    }
  }
}

module.exports = {
  Server: Server
};

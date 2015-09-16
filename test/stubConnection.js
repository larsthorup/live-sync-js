'use strict';

// Note: this class is an in-process test-friendly variant of WebConnection
class StubConnection {
  constructor (downstreamServer, upstreamServer) {
    Object.assign(this, {downstreamServer, upstreamServer}, {
      commandCount: 0
    });
  }

  static connecting (downstreamServer, upstreamServer) {
    var connection = new StubConnection(downstreamServer, upstreamServer);
    return downstreamServer.connectingUpstream(connection);
  }

  sendingCommand (cmd) {
    ++this.commandCount;
    return this.upstreamServer.processingFromDownstream(cmd);
  }

  receivingCommands () {
    let commands = this.upstreamServer.processedCommands;
    this.commandCount += Object.keys(commands).length;
    return Promise.resolve(commands);
  }

  resetCommandCount () {
    let count = this.commandCount;
    this.commandCount = 0;
    return count;
  }
}

module.exports = {
  StubConnection: StubConnection
};

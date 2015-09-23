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
    return downstreamServer.connectingUpstream(connection).then(() => {
      return upstreamServer.connectingDownstream(connection);
    });
  }

  sendingCommand (cmd) {
    ++this.commandCount;
    let processing = [];
    processing.push(this.upstreamServer.processingFromDownstream(cmd));
    // ToDo: extract this loop to base class
    this.downstreamServer.downstreamConnections.forEach(downstreamConnection => {
      processing.push(downstreamConnection.downstreamServer.processingFromUpstream(cmd));
    });
    return Promise.all(processing);
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

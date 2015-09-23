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

  sendingCommandUpstream (cmd) {
    ++this.commandCount;
    if (!this.upstreamServer.hasSeen(cmd)) {
      return this.upstreamServer.processing(cmd);
    } else {
      return Promise.resolve();
    }
  }

  sendingCommandDownstream (cmd) {
    if (!this.downstreamServer.hasSeen(cmd)) {
      return this.downstreamServer.processing(cmd);
    } else {
      return Promise.resolve();
    }
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

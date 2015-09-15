'use strict';
class Server {
  constructor (name) {

  }

  connectingUpstream (server) {
    return Promise.resolve();
  }

  synchronizingUpstream (server) {
    return Promise.resolve();
  }

  gettingRankSum (statement) {
    return Promise.resolve(4);
  }
}

module.exports = {
  Server: Server
};

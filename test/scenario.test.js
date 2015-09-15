/* eslint-env mocha */

var Client = require('../src/client').Client;
var Server = require('../src/server').Server;

// Note: being a scenario test, the individual it() blocks are not meant to be run in isolation
describe('scenario', () => {
  before(() => {
    this.clientSusan = new Client('Susan');
    this.clientDavid = new Client('David');
    this.clientAlbert = new Client('David');
    this.serverEurope = new Server('Europe');
    return this.clientSusan.server.connectingUpstream(this.serverEurope);
  });

  it('should create data', () => {
    return this.clientSusan.creatingRank('Peace', 4);
  });

  it('should create data locally', () => {
    return this.clientSusan.server.repo.gettingRankSum('Peace').should.become(4);
  });

  it('should send data upstream', () => {
    return this.clientSusan.server.synchronizingUpstream();
  });

  it('should receive data from downstream', () => {
    return this.serverEurope.repo.gettingRankSum('Peace').should.become(4);
  });

  it('should receive relevant data from upstream', () => {
    return this.clientDavid.server.synchronizingUpstream();
  });

  it.skip('should receive data downstream if interested', () => {
    return this.clientDavid.server.repo.gettingRankSum('Peace').should.become(4);
  });

  it('should receive relevant data from upstream', () => {
    return this.clientAlbert.server.synchronizingUpstream();
  });

  it('should not receive data downstream if not interested', () => {
    return this.clientAlbert.server.repo.gettingRankSum('Peace').should.become(0);
  });

  // ToDo: multi level sync
  // ToDo: aggregate rank sum instead of calculating
  // ToDo: use injected (websocket or stub (switch a flag)) protocol instead of a direct server reference
  // ToDo: trigger synchronization automatically from the changed data
  // ToDo: joining a new server
  // ToDo: taking a server offline for a while
  // ToDo: bringing a server offline after a while
  // ToDo: retry synchronization when it fails
  // ToDo: throttle synchronization to control overhead
  // ToDo: try using swarm.js for this
});

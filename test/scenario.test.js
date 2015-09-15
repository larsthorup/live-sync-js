/* eslint-env mocha */

var Client = require('../src/client').Client;
var Server = require('../src/server').Server;

// Note: being a scenario test, the individual it() blocks are not meant to be run in isolation
describe('scenario', () => {
  before(() => {
    this.clientSusan = new Client('Susan');
    this.clientDavid = new Client('David');
    this.serverEurope = new Server('Europe');
    return this.clientSusan.server.connectingUpstream(this.serverEurope);
  });

  it('should create data', () => {
    return this.clientSusan.creatingRank('Peace', 4);
  });

  it('should create data locally', () => {
    return this.clientSusan.server.gettingRankSum('Peace').should.become(4);
  });

  it('should send data upstream', () => {
    // ToDo: this should be triggered automatically from the new data
    return this.clientSusan.server.synchronizingUpstream();
  });

  it('should receive data from downstream', () => {
    return this.serverEurope.gettingRankSum('Peace').should.become(4);
  });

  it('should send data downstream to interested parties', () => {
    // ToDo: this should be triggered automatically from the changed data
    return this.serverEurope.synchronizingUpstream();
  });

  it('should receive data from upstream', () => {
    return this.clientDavid.server.gettingRankSum('Peace').should.become(4);
  });
});

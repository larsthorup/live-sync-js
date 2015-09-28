/* eslint-env mocha */

'use strict';

let Client = require('../src/client').Client;
let Server = require('../src/server').Server;
var StubConnection = require('./stubConnection').StubConnection;

// Note: being a scenario test, the individual it() blocks are not meant to be run in isolation
describe('scenario', () => {
  before(() => {
    this.clientSusan = new Client('Susan');
    this.clientDavid = new Client('David');
    this.clientAlbert = new Client('David');
    this.serverEurope = new Server('Europe');
    this.serverGlobal = new Server('Global');
    let connecting = [
      StubConnection.connecting(this.clientSusan.server, this.serverEurope),
      StubConnection.connecting(this.clientDavid.server, this.serverEurope),
      StubConnection.connecting(this.clientAlbert.server, this.serverEurope),
      StubConnection.connecting(this.serverEurope, this.serverGlobal)
    ];
    return Promise.all(connecting);
  });

  it('should create data', () =>
    this.clientSusan.creatingRank('Peace', 4)
  );

  it('should create data locally', () =>
    this.clientSusan.server.repo.gettingRankSum('Peace').should.become(4)
  );

  it('should transmit no more than 1 commands on sync', () =>
    this.clientSusan.server.upstreamConnection.resetCommandCount().should.equal(1)
  );

  it('should receive data from downstream', () =>
    this.serverEurope.repo.gettingRankSum('Peace').should.become(4)
  );

  it('should transmit no more than 1 commands on sync', () =>
    this.serverEurope.upstreamConnection.resetCommandCount().should.equal(1)
  );

  it('should receive data from further downstream', () =>
    this.serverGlobal.repo.gettingRankSum('Peace').should.become(4)
  );

  it('should receive data from upstream if interested', () =>
    this.clientDavid.server.repo.gettingRankSum('Peace').should.become(4)
  );

  it.skip('should not receive data downstream if not interested', () => // ToDo
    this.clientAlbert.server.repo.gettingRankSum('Peace').should.become(0)
  );

  it('should send data upstream', () =>
    this.clientSusan.server.synchronizing()
  );

  // ToDo: optimization: only send new commands
  // ToDo: optimization: only retrieve new commands
  it('should transmit no more than 1 (should actually be 0) commands on sync', () =>
    this.clientSusan.server.upstreamConnection.resetCommandCount().should.equal(1)
  );

  it('should receive data from downstream', () =>
    this.serverEurope.repo.gettingRankSum('Peace').should.become(4)
  );

  // Note: joining a new server
  it('should enable adding a new server', () => {
    this.serverAsia = new Server('Asia');
    return StubConnection.connecting(this.serverAsia, this.serverGlobal);
  });

  it('should enable adding a new client', () => {
    this.clientLakshmi = new Client('Lakshmi');
    return StubConnection.connecting(this.clientLakshmi.server, this.serverAsia);
  });

  it('should immediately sync data to the new client', () =>
    this.clientLakshmi.server.repo.gettingRankSum('Peace').should.become(4)
  );

  it('should create data on new client', () =>
    this.clientLakshmi.creatingRank('Peace', 7)
  );

  it('should sync data from new client to existing clients', () =>
    this.clientSusan.server.repo.gettingRankSum('Peace').should.become(11)
  );

  it('should sync data from existing clients to new client', () =>
    this.clientLakshmi.server.repo.gettingRankSum('Peace').should.become(11)
  );

  // ToDo: aggregate rank sum instead of calculating
  // ToDo: taking a server offline for a while
  // ToDo: bringing a server online after a while
  // ToDo: retry synchronization when it fails
  // ToDo: throttle synchronization to control overhead and prevent buffer overflows
  // ToDo: try using swarm.js, share.js for this
  // ToDo: data versioning, migrations
  // ToDo: distributed aggregation
});

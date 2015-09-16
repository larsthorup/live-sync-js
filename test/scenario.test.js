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
    let connecting = [
      StubConnection.connecting(this.clientSusan.server, this.serverEurope),
      StubConnection.connecting(this.clientDavid.server, this.serverEurope),
      StubConnection.connecting(this.clientAlbert.server, this.serverEurope)
    ];
    return Promise.all(connecting);
  });

  it('should create data', () =>
    this.clientSusan.creatingRank('Peace', 4)
  );

  it('should create data locally', () =>
    this.clientSusan.server.repo.gettingRankSum('Peace').should.become(4)
  );

  it('should send data upstream', () =>
    this.clientSusan.server.synchronizingUpstream()
  );

  it('should transmit no more than 1 commands on sync', () =>
    this.clientSusan.server.upstreamConnection.resetCommandCount().should.equal(1)
  );

  it('should receive data from downstream', () =>
    this.serverEurope.repo.gettingRankSum('Peace').should.become(4)
  );

  it('should receive relevant data from upstream', () =>
    this.clientDavid.server.synchronizingUpstream()
  );

  it('should receive data downstream if interested', () =>
    this.clientDavid.server.repo.gettingRankSum('Peace').should.become(4)
  );

  it('should receive relevant data from upstream', () =>
    this.clientAlbert.server.synchronizingUpstream()
  );

  it.skip('should not receive data downstream if not interested', () =>
    this.clientAlbert.server.repo.gettingRankSum('Peace').should.become(0)
  );

  it('should ignore synchronization when no upstream server', () =>
    this.serverEurope.synchronizingUpstream()
  );

  it('should send data upstream', () =>
    this.clientSusan.server.synchronizingUpstream()
  );

  // ToDo: optimization: only send new commands
  // ToDo: optimization: only retrieve new commands
  it('should transmit no more than 2 (should actually be 0) commands on sync', () =>
    this.clientSusan.server.upstreamConnection.resetCommandCount().should.equal(2)
  );

  it('should receive data from downstream', () =>
    this.serverEurope.repo.gettingRankSum('Peace').should.become(4)
  );

  // ToDo: command line interface
  // ToDo: multi level sync
  // ToDo: aggregate rank sum instead of calculating
  // ToDo: trigger synchronization automatically from the changed data
  // ToDo: joining a new server
  // ToDo: taking a server offline for a while
  // ToDo: bringing a server online after a while
  // ToDo: retry synchronization when it fails
  // ToDo: throttle synchronization to control overhead
  // ToDo: try using swarm.js, share.js for this
  // ToDo: data versioning, migrations
});

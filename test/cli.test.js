/* eslint-env mocha */

'use strict';

let MonitorServer = require('../src/monitor/server').Server;
let Process = require('./process').Process;

describe('cli', function () {
  var monitor;

  before(function () {
    monitor = new MonitorServer(1770);
    return monitor.listening();
  });

  after(function () {
    return monitor.closing();
  });

  it('should fail to start with invalid command line', (done) => {
    let cli = new Process('node src/cli');
    cli.closing().then(() => {
      cli.stdout.should.equal('Missing --port <number>\n');
      done();
    });
  });

  describe('starting a server', function () {
    before(function () {
      this.server = new Process('node src/cli --port 1771 --name europe --monitor ws://localhost:1770');
    });

    after(function (done) {
      this.server.closing().then(done);
      this.server.terminate();
    });

    it('should monitor as started', function (done) {
      // ToDo: why can't I just return the promise here?
      monitor.expecting({name: 'europe', action: 'started'}).then(() => {
        done();
      });
    });

    describe('starting a client', function () {
      before(function () {
        this.client = new Process('node src/cli --client --port 1772 --name susan --monitor ws://localhost:1770 --upstream ws://localhost:1771');
      });

      after(function (done) {
        this.client.closing().then(done);
        this.client.terminate();
      });

      it('should monitor as started', function (done) {
        // ToDo: why can't I just return the promise here?
        monitor.expecting({name: 'susan', action: 'started'}).then(() => {
          done();
        });
      });
    });
  });
});

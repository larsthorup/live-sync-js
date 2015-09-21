/* eslint-env mocha */

'use strict';

let MonitorServer = require('../src/monitor/server').Server;
let Process = require('./process').Process;

describe('cli', function () {
  this.timeout(5000);
  var monitor;

  before(function () {
    monitor = new MonitorServer(1770);
    return monitor.listening();
  });

  after(function () {
    return monitor.closing();
  });

  it('should fail to start with invalid command line', function () {
    let cli = new Process('node src/cli');
    return cli.closing().then(() => {
      cli.stdout.should.equal('Missing --port <number>\n');
    });
  });

  describe('starting a server', function () {
    before(function () {
      this.server = new Process('node src/cli --port 1771 --name europe --monitor ws://localhost:1770');
    });

    after(function () {
      let closing = this.server.closing();
      this.server.terminate();
      return closing;
    });

    it('should monitor as started', function () {
      return monitor.expecting({name: 'europe', action: 'started'});
    });

    describe('starting a client', function () {
      before(function () {
        this.client = new Process('node src/cli --client --port 1772 --name susan --monitor ws://localhost:1770 --upstream ws://localhost:1771');
      });

      after(function () {
        let closing = this.client.closing();
        this.client.terminate();
        return closing;
      });

      it('should monitor as started', function () {
        return monitor.expecting({name: 'susan', action: 'started'});
      });

      describe('interacting with client', function () {
        before(function () {
          this.client.write('12');
        });

        it('should monitor as receiving command', function () {
          return monitor.expecting({name: 'europe', action: 'command', from: 'susan'});
        });
      });
    });
  });
});

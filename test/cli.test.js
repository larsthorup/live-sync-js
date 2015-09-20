/* eslint-env mocha */

'use strict';

let childProcess = require('child_process');
var treeKill = require('tree-kill');

let MonitorServer = require('../src/monitor').Server;

describe('cli', function () {
  var monitor;

  before(function () {
    monitor = new MonitorServer(1770);
    return monitor.listening();
  });

  after(function () {
    // console.log('about to close monitor');
    return monitor.closing();
  });

  it.skip('should fail to start with invalid command line', (done) => {
    let cli = childProcess.exec('node src/cli');
    logUntilExit(cli, (code, signal, stdout) => {
      stdout.should.equal('Missing --port <number>\n');
      done();
    });
  });

  describe('starting a server', function () {
    beforeEach(function () {
      this.server = new Process('node src/cli --port 1771 --name europe --monitor ws://localhost:1770');
    });

    afterEach(function (done) {
      this.server.closing().then(() => {
        // console.log('code', this.server.code);
        // console.log('signal', this.server.signal);
        // console.log('stdout', this.server.stdout);
        // console.log('stderr', this.server.stderr);
        // this.server.signal.should.equal('SIGTERM');
        done();
      });
      this.server.terminate();
    });

    it('should monitor as started', function (done) {
      // ToDo: why can't I just return the promise here?
      monitor.logging({name: 'europe', action: 'started'}).then(() => {
        // console.log('succeeded???');
        done();
      });
    });
  });
});

class Process {
  constructor (cmd) {
    Object.assign(this, {
      process: childProcess.exec(cmd),
      stdout: '',
      stderr: '',
      running: true
    });
    this.process.stdout.on('data', data => {
      this.stdout += data;
    });
    this.process.stderr.on('data', data => {
      this.stderr += data;
    });
    this.process.on('exit', (code, signal) => {
      // console.log('process exit', code, signal)
      Object.assign(this, {code, signal}, {
        running: false
      });
      if (this.exitHandler) (this.exitHandler)();
    });
  }

  closing () {
    // console.log('running',this.running)
    if (this.running) {
      return new Promise((resolve) => {
        this.exitHandler = resolve;
      });
    } else {
      return Promise.resolve();
    }
  }

  terminate () {
    // console.log('terminating process', this.process.pid);
    treeKill(this.process.pid, 'SIGTERM');
  }
}

function logUntilExit (process, next) {
  var stdout = '';
  process.stdout.on('data', function (data) {
    stdout += data;
  });
  var stderr = '';
  process.stderr.on('data', function (data) {
    stderr += data;
  });
  process.on('exit', (code, signal) => {
    next(code, signal, stdout, stderr);
  });
}

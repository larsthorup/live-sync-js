/* eslint-env mocha */

'use strict';

let childProcess = require('child_process');

describe('cli', function () {
  it('validates command line', (done) => {
    var cli = childProcess.exec('node src/cli');
    logUntilExit(cli, (code, signal, stdout) => {
      stdout.should.equal('Missing --port <number>\n');
      done();
    });
  });

  it('starts server', (done) => {
    var server = childProcess.exec('node src/cli --port 1771');
    logUntilExit(server, (code, signal, stdout) => {
      signal.should.equal('SIGTERM');
      done();
    });
    server.kill();
  });
});

function logUntilExit (process, next) {
  var stdout = '';
  process.stdout.on('data', function (data) {
    stdout += data;
  });
  process.on('exit', (code, signal) => {
    next(code, signal, stdout);
  });
}

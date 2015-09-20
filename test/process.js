'use strict';

let childProcess = require('child_process');
let treeKill = require('tree-kill');

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
      Object.assign(this, {code, signal}, {
        running: false
      });
      if (this.exitHandler) (this.exitHandler)();
    });
  }

  closing () {
    if (this.running) {
      return new Promise((resolve) => {
        this.exitHandler = resolve;
      });
    } else {
      return Promise.resolve();
    }
  }

  terminate () {
    treeKill(this.process.pid, 'SIGTERM');
  }
}

module.exports = {
  Process: Process
};

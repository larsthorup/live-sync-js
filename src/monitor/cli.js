'use strict';

let meow = require('meow');

let Server = require('./server').Server;

let help = `Usage:
  node src/monitor/cli [options]
Options:
  --port <number>`;

let args = meow({
  pkg: '../../package.json',
  help: help
});

if (!args.flags.port) {
  console.log('Missing --port <number>');
  process.exit(0);
}

let server = new Server(args.flags.port);
server.listening();

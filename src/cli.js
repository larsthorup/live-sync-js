'use strict';

let meow = require('meow');

let Listener = require('./listener').Listener;

let help = `Usage:
  node src/cli [options]
Options:
  --port <number>`;

let args = meow({
  pkg: '../package.json',
  help: help
});

if (!args.flags.port) {
  console.log('Missing --port <number>');
  process.exit(0);
}

let listener = new Listener(args.flags);
listener.listening().then(() => {
  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(1);
});

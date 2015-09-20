'use strict';

let meow = require('meow');

let Client = require('./client').Client;
let Listener = require('./listener').Listener;
let Server = require('./server').Server;
let SocketConnection = require('./socketConnection').SocketConnection;
let MonitorClient = require('./monitor').Client;

let help = `Usage:
  node src/cli [options]
Options:
  --client (optional)
  --name <string>
  --port <number>
  --upstream <server> (optional)
  --monitor <server> (optional)`;

let args = meow({
  pkg: '../package.json',
  help: help
});

if (!args.flags.port) {
  console.log('Missing --port <number>');
  process.exit(0);
}

let client = args.flags.client ? new Client(args.flags.name) : null;
let server = client ? client.server : new Server(args.flags.name);

let monitor = new MonitorClient(args.flags.monitor);

monitor.connecting().then(() => {
  var listenerOptions = Object.assign({}, args.flags, {monitor});
  let listeningDownstream = new Listener(listenerOptions).listening();
  let bootingSteps = [listeningDownstream];
  if (args.flags.upstream) {
    let connectingUpstream = SocketConnection.connecting(server, args.flags.upstream);
    bootingSteps.push(connectingUpstream);
  }
  function exit () {
    monitor.logging({name: server.name, action: 'stopped'}).then(() => {
      monitor.disconnect();
      process.exit(0);
    });
  }
  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    exit();
  });
  process.on('SIGINT', () => {
    console.log('SIGINT received');
    exit();
  });
  return Promise.all(bootingSteps);
}).then(() => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

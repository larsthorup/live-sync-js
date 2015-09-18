'use strict';

let meow = require('meow');

let Client = require('./client').Client;
let Listener = require('./listener').Listener;
let Server = require('./server').Server;
let SocketConnection = require('./socketConnection').SocketConnection;

let help = `Usage:
  node src/cli [options]
Options:
  --client (optional)
  --name <string>
  --port <number>
  --upstream <server> (optional)`;

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

let listeningDownstream = new Listener(args.flags).listening();
let bootingSteps = [listeningDownstream];
if (args.flags.upstream) {
  let connectingUpstream = SocketConnection.connecting(server, args.flags.upstream);
  bootingSteps.push(connectingUpstream);
}
let booting = Promise.all(bootingSteps);

booting.then(() => {
  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(1);
});

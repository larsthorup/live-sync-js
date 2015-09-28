'use strict';

let meow = require('meow');

let Client = require('./client').Client;
let Listener = require('./listener').Listener;
let Server = require('./server').Server;
let SocketConnection = require('./socketConnection').SocketConnection;
let MonitorClient = require('./monitor/client').Client;

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

// ToDo: refactor all this bootstrap code
let client = args.flags.client ? new Client(args.flags.name) : null;
let server = client ? client.server : new Server(args.flags.name);
let monitor = new MonitorClient(args.flags.monitor);
function exit (signal) {
  console.log(`${signal} received`);
  monitor.logging({
    name: server.name,
    action: 'stopped'
  }).then(() => {
    monitor.disconnect();
    process.exit(0);
  });
}
['SIGTERM', 'SIGINT'].forEach(signal => process.on(signal, () => exit(signal)));

monitor.connecting().then(() => {
  let listenerOptions = Object.assign({}, args.flags, {server, monitor});
  let listener = new Listener(listenerOptions);
  let listeningDownstream = listener.listening();
  let bootingSteps = [listeningDownstream];
  if (args.flags.upstream) {
    let connectionOptions = {
      upstreamConnectionString: args.flags.upstream,
      server,
      monitor
    };
    let connectingUpstream = SocketConnection.connectingUpstream(connectionOptions).then(connection => {
      return server.connectingUpstream(connection);
    });
    bootingSteps.push(connectingUpstream);
  }
  return Promise.all(bootingSteps).then(() => {
    if (client) {
      process.stdin.on('data', chunk => {
        client.creatingRank('Peace', parseInt(chunk, 10)).then(() => {
          return client.server.repo.gettingRankSum();
        }).then(rankSum => {
          console.log('rank sum now:', rankSum);
        }).then(() => {
          return client.server.synchronizing();
        }).catch(err => {
          console.log(err);
        });
      });
    }
    return monitor.logging({name: server.name, action: 'started'});
  }).then(() => {
    return listener.closing();
  });
}).then(() => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

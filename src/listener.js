'use strict';

let restify = require('restify');
let ws = require('ws');

class Listener {
  constructor (options) {
    Object.assign(this, options, {
      log: console.log,
      latestClientId: 0
    });
  }

  listening () {
    return new Promise((resolve, reject) => {
      let server = restify.createServer({
        name: this.name
      });

      this.socketServer = new ws.Server({
        server: server.server
      });
      this.socketServer.on('connection', this.onConnect.bind(this));

      this.socketClosing = new Promise((resolve) => {
        server.on('close', () => {
          this.log(`${server.name} closing down`);
          resolve();
        });
      });

      server.listen(this.port, () => {
        this.log(`${server.name} listening at ${server.url}`);
        resolve();
      });
    });
  }

  closing () {
    return this.socketClosing;
  }

  onConnect (connection) {
    let clientId = ++this.latestClientId;
    connection.clientId = clientId;
    // connections[clientId] = connection;
    this.log('WebSocket connection established', clientId);
    connection.on('close', function (code, message) {
      console.log('WebSocket connection closed', this.clientId);
      // subscriptions.unsubscribeClient(this.clientId);
      // delete connections[this.clientId];
    });
    connection.on('message', this.onMessage.bind(this));
  }

  onMessage (data) {
    var message = JSON.parse(data);
    console.log('received', message);
    switch (message.type) {
      case 'send-command':
        this.server.processingFromDownstream(message.data).then(() => {
          return this.server.repo.gettingRankSum();
        }).then(rankSum => {
          console.log('rank sum now:', rankSum);
        }).catch(err => {
          console.log(err);
        });
        break;
    }
  }
}

module.exports = {
  Listener: Listener
};

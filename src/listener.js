'use strict';

let restify = require('restify');

class Listener {
  constructor (options) {
    Object.assign(this, options, {
      log: console.log
    });
  }

  listening () {
    return new Promise((resolve, reject) => {
      var server = restify.createServer({
        name: this.name
      });

      server.listen(this.port, () => {
        this.log(`${server.name} listening at ${server.url}`);
      });

      server.on('close', () => {
        this.log(`${server.name} closing down`);
        resolve();
      });
    });
  }
}

module.exports = {
  Listener: Listener
};

'use strict';

var uuid = require('uuid').v4;

class Repo {
  constructor () {
    Object.assign(this, {
      ranks: []
    });
  }

  makeAddRankCommand (cmd) {
    return Object.assign({}, cmd, {
      id: uuid(),
      verb: 'add',
      domain: 'rank',
      objectType: 'statement'
    });
  }

  processing (cmd) {
    switch (cmd.domain) {
      case 'rank':
        switch (cmd.verb) {
          case 'add':
            this.ranks.push({
              rank: cmd.value
            });
            break;
        }
        break;
    }
    return Promise.resolve();
  }

  gettingRankSum (statement) {
    var rankSum = this.ranks.reduce((sum, r) => sum + r.rank, 0);
    return Promise.resolve(rankSum);
  }
}

module.exports = {
  Repo: Repo
};

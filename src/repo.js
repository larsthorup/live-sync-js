'use strict';

class Repo {
  constructor () {
    this.ranks = [];
  }

  processing (cmd) {
    switch (cmd.domain) {
      case 'rank':
        switch (cmd.command) {
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

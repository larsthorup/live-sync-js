/* eslint-env amd, mocha */

var Client = require('../src/client').Client;

// Note: being a scenario test, the individual it() blocks are not meant to be run in isolation
describe('scenario', () => {
  before(() => {
    this.clientSusan = new Client('clientSusan');
  });

  it('should send data upstream', () => {
    return this.clientSusan.ranking('statementPeace', 4);
  });

  it('should receive data from downstream');

  it('should sync data downstream to interested parties');
});

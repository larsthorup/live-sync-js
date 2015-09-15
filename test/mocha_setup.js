var chai = require('chai');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');

// Chai setup
chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

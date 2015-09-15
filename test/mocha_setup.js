/* eslint-env amd */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['chai', 'sinon-chai'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('chai'), require('sinon-chai'));
  }
}(function (chai, sinonChai) {
  // Chai setup
  chai.should();
  chai.use(sinonChai);
  // chai.use(require('chai-as-promised')); // Note: enable the eventually expectation
}));

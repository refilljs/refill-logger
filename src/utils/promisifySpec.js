'use strict';

describe('utils/promisify', function() {

  beforeEach(function() {
    this.promisify = require('./promisify');
    this.streamMock = jasmine.createSpyObj('streamMock', ['on']);
    this.streamMock.on.and.returnValue(this.streamMock);
  });

  it('should resolve promise with stream when stream ends', function(next) {

    var that = this;

    this.promisify(this.streamMock)
      .then(function(resolver) {
        expect(resolver).toBe(that.streamMock);
        next();
      });

    this.streamMock.on.calls.argsFor(0)[1]();

  });

  it('should reject promise with error when stream have error', function(next) {

    var error = 'error message';

    this.promisify(this.streamMock)
      .catch(function(rejecter) {
        expect(rejecter).toBe(error);
        next();
      });

    this.streamMock.on.calls.argsFor(1)[1](error);

  });

});

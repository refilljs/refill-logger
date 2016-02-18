'use strict';

var proxyquire = require('proxyquire');

describe('utils/promisify', function() {

  beforeEach(function() {

    this.stream = {};
    this.endOfStream = jasmine.createSpy('endOfStream');
    this.streamConsume = jasmine.createSpy('streamConsume');
    this.promisify = proxyquire('./promisify', {
      'end-of-stream': this.endOfStream,
      'stream-consume': this.streamConsume
    });

  });

  it('should consume stream', function() {
    this.promisify(this.stream);
    expect(this.streamConsume).toHaveBeenCalledWith(this.stream);
  });

  it('when stream ends should resolve promise with stream', function(next) {

    var that = this;

    this.promisify(this.stream)
      .then(function(resolver) {
        expect(resolver).toBe(that.stream);
        next();
      });

    this.endOfStream.calls.argsFor(0)[1]();

  });

  it('when stream have error should reject promise with this error', function(next) {

    var error = 'error message';

    this.promisify(this.stream)
      .catch(function(rejecter) {
        expect(rejecter).toBe(error);
        next();
      });

    this.endOfStream.calls.argsFor(0)[1](error);

  });

});

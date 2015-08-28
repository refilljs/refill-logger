'use strict';

var q = require('q');

module.exports = function checkNotWatchNotIgnoringFailures() {

  describe('and promise resolves', function() {

    beforeEach(function(next) {
      this.deferred.resolve();
      this.deferred.promise.then(next);
    });

    it('should call next', function() {
      expect(this.nextMock).toHaveBeenCalled();
    });

    it('should call logger.finished', function() {
      expect(this.loggerMock.finished).toHaveBeenCalled();
    });

    it('and then promise resolves again should NOT call next', function(next) {

      var otherDeferred = q.defer();
      var that = this;

      this.nextMock.calls.reset();

      this.nextHandler.handle(otherDeferred.promise);

      otherDeferred.promise
        .then(function() {
          expect(that.nextMock).not.toHaveBeenCalled();
          next();
        });

      otherDeferred.resolve();

    });

  });

  describe('and promise rejects', function() {

    beforeEach(function(next) {
      this.errorMessage = 'mock error message';
      this.deferred.reject(this.errorMessage);
      this.deferred.promise.catch(next);
    });

    it('should call next with error message', function() {
      expect(this.nextMock).toHaveBeenCalled();
    });

    it('should call logger.error with error messageand then logger.finished', function() {
      expect(this.loggerMock.error).toHaveBeenCalledWith({
        message: this.errorMessage
      });
    });

  });

};

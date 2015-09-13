'use strict';

module.exports = function checkWatch() {

  describe('and promise resolves', function() {

    beforeEach(function(next) {
      this.deferred.resolve();
      this.deferred.promise.then(next);
    });

    it('should call next', function() {
      expect(this.nextMock).toHaveBeenCalled();
    });

    it('should NOT call logger.finished', function() {
      expect(this.loggerMock.finished).not.toHaveBeenCalled();
    });

  });

  describe('and promise rejects', function() {

    beforeEach(function(next) {
      this.errorMessage = 'mock error message';
      this.deferred.reject(this.errorMessage);
      this.deferred.promise.catch(next);
    });

    it('should NOT call next', function() {
      expect(this.nextMock).not.toHaveBeenCalled();
    });

    it('should call logger.error with error message', function() {
      expect(this.loggerMock.error).toHaveBeenCalledWith({
        message: this.errorMessage
      });
    });

  });

};

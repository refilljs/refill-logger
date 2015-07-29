'use strict';

describe('utils/NextHandler', function() {

  beforeEach(function() {
    this.q = require('q');
    this.deferred = this.q.defer();

    this.nextMock = jasmine.createSpy('nextMock');
    this.loggerMock = jasmine.createSpyObj('loggerMock', ['finished', 'error']);

    this.NextHandler = require('./NextHandler');
  });

  describe('when NOT in watch mode', function() {

    describe('and NOT ignoring failures', function() {

      beforeEach(function() {
        this.nextHandler = new this.NextHandler({
          next: this.nextMock,
          logger: this.loggerMock,
          watch: false
        });

        this.nextHandler.handle(this.deferred.promise);
        expect(this.nextMock).not.toHaveBeenCalled();
      });

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

          var otherDeferred = this.q.defer();
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

    });

    describe('and ignoring failures', function() {

      beforeEach(function() {
        this.nextHandler = new this.NextHandler({
          next: this.nextMock,
          logger: this.loggerMock,
          watch: false,
          ignoreFailures: true
        });

        this.nextHandler.handle(this.deferred.promise);
        expect(this.nextMock).not.toHaveBeenCalled();
      });

      describe('and promise rejects', function() {

        beforeEach(function(next) {
          this.errorMessage = 'mock error message';
          this.deferred.reject(this.errorMessage);
          this.deferred.promise.catch(next);
        });

        it('should call next without error message', function() {
          expect(this.nextMock).toHaveBeenCalledWith();
        });

      });

    });

  });

  describe('when in watch mode', function() {

    beforeEach(function() {
      this.nextHandler = new this.NextHandler({
        next: this.nextMock,
        logger: this.loggerMock,
        watch: true
      });

      this.nextHandler.handle(this.deferred.promise);
      expect(this.nextMock).not.toHaveBeenCalled();
    });

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

      it('should call logger.error with error messageand then logger.finished', function() {
        expect(this.loggerMock.error).toHaveBeenCalledWith({
          message: this.errorMessage
        });
      });

    });

  });

});

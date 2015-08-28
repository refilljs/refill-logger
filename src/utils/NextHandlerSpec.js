'use strict';

describe('utils/NextHandler', function() {

  var q = require('q');
  var checkNotWatchNotIgnoringFailures = require('./NextHandlerSpec/checkNotWatchNotIgnoringFailures');
  var checkNotWatchIgnoringFailures = require('./NextHandlerSpec/checkNotWatchIgnoringFailures');
  var checkWatch = require('./NextHandlerSpec/checkWatch');

  beforeEach(function() {

    this.deferred = q.defer();

    this.nextMock = jasmine.createSpy('nextMock');
    this.loggerMock = jasmine.createSpyObj('loggerMock', ['finished', 'error', 'info']);

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

      checkNotWatchNotIgnoringFailures();

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

      checkNotWatchIgnoringFailures();

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

    checkWatch();

  });

});

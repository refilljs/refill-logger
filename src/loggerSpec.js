'use strict';

describe('utils/logger', function() {

  it('should create new logger with name', function() {

    var logger;
    spyOn(console, 'log');
    logger = require('./logger');
    logger('name');

  });

});

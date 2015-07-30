'use strict';

describe('utils/logger', function() {

  it('should create new logger with name', function() {

    spyOn(console, 'log');
    var logger = require('./logger');
    logger('name');

  });

});

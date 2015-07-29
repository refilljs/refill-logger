'use strict';

describe('utils/Logger', function() {

  it('should create new logger with name', function() {

    spyOn(console, 'log');
    var Logger = require('./Logger');
    new Logger('name');

  });

});

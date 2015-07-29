'use strict';

var once = require('once');

function NextHandler(options) {
  this.options = options;
  this.onceNext = once(options.next);
}

NextHandler.prototype.handle = function(promise) {
  var that = this;

  promise.then(function() {
    that.options.logger.finished();
    that.onceNext();
  });

  promise.catch(function(error) {
    that.options.logger.error({
      message: error
    });
    if (that.options.watch) {
      return;
    }
    if (that.options.ignoreFailures) {
      that.onceNext();
      return;
    }
    that.onceNext(error);
  });

};

module.exports = NextHandler;

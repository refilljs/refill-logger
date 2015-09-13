'use strict';

var once = require('once');
var _ = require('lodash');

function NextHandler(options) {
  this.options = options;
  this.onceNext = once(options.next);
}

NextHandler.prototype.handle = function(promise, options) {

  var that = this;
  var computedOptions = _.defaults({}, options, this.options, {
    handleSuccess: true,
    ignoreFailures: false
  });

  function finished() {
    if (!that.onceNext.called) {
      return;
    }
    computedOptions.logger.finished();
  }

  promise.catch(function(error) {

    if (computedOptions.ignoreFailures) {
      computedOptions.logger.info(error);
      finished();
      that.onceNext();
      return;
    }

    computedOptions.logger.error({
      message: error
    });

    if (computedOptions.watch) {
      computedOptions.logger.finished();
      return;
    }

    finished();
    that.onceNext(error);

  });

  if (!computedOptions.handleSuccess) {
    return promise;
  }

  promise.then(function() {
    finished();
    that.onceNext();
  });

  return promise;

};

module.exports = NextHandler;

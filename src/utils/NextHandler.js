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

  if (computedOptions.handleSuccess) {
    promise.then(function() {
      computedOptions.logger.finished();
      that.onceNext();
    });
  }

  promise.catch(function(error) {

    if (computedOptions.ignoreFailures) {
      computedOptions.logger.info(error);
      computedOptions.logger.finished();
      that.onceNext();
      return;
    }

    computedOptions.logger.error({
      message: error
    });
    computedOptions.logger.finished();

    if (computedOptions.watch) {
      return;
    }

    that.onceNext(error);
    return;

  });

  return promise;

};

module.exports = NextHandler;

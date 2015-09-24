'use strict';

function promiseGlobby(globs, filesNotFoundMessage, options) {

  var q = require('q');
  var globby = require('globby');
  var deferred = q.defer();

  globby(globs, options).then(function(paths) {
    if (paths.length === 0) {
      deferred.reject(filesNotFoundMessage);
      return;
    }
    deferred.resolve(paths);
  }, deferred.reject);

  return deferred.promise;

}

module.exports = promiseGlobby;

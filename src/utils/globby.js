'use strict';

function promiseGlobby(globs, filesNotFoundMessage, options) {

  var q = require('q');
  var globby = require('globby');
  var deferred = q.defer();

  globby(globs, options, function(error, files) {
    if (error !== null) {
      deferred.reject(error);
      return;
    }
    if (files.length === 0) {
      deferred.reject(filesNotFoundMessage);
      return;
    }
    deferred.resolve(files);
    return;
  });

  return deferred.promise;

}

module.exports = promiseGlobby;

'use strict';

var q = require('q');

function promisify(stream) {

  var deferred = q.defer();

  stream
    .on('end', deferred.resolve.bind(undefined, stream))
    .on('error', deferred.reject);

  return deferred.promise;

}

module.exports = promisify;

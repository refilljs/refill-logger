'use strict';

var q = require('q');
var endOfStream = require('end-of-stream');
var streamConsume = require('stream-consume');

function promisify(stream) {

  var deferred = q.defer();

  endOfStream(stream, function(error) {

    if (error) {
      deferred.reject(error);
      return;
    }

    deferred.resolve(stream);

  });

  streamConsume(stream);

  return deferred.promise;

}

module.exports = promisify;

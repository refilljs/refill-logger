'use strict';

var q = require('q');
var del = require('del');

module.exports = q.denodeify(del);

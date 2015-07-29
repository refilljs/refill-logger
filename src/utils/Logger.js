'use strict';

var chalk = require('chalk');
var _ = require('lodash');
var prefix = chalk.green('◹ zkflow');
var prettyHrtime = require('pretty-hrtime');
var startSymbol = chalk.cyan.bold('►');
var stopSymbol = chalk.cyan.bold('▪');
var restartSymbol = chalk.cyan.bold('↻');
var path = require('path');
var moment = require('moment');

function formatPath(filePaths) {

  var formattedPaths;

  if (typeof filePaths.path !== 'undefined') {
    filePaths = filePaths.path;
  }

  if (!_.isArray(filePaths)) {
    filePaths = [filePaths];
  }

  formattedPaths = _.map(filePaths, function(filePath) {
    return path.relative(process.cwd(), filePath);
  }).join(', ');

  return chalk.gray(formattedPaths);

}

function Logger(name) {

  var startHrtime;

  this.log = function log(textTemplate) {
    var logArguments = Array.prototype.slice.call(arguments, 1);
    logArguments.unshift('%s %s %s ' + textTemplate, chalk.gray(moment().format('HH:mm')), prefix, chalk.cyan.bold(name));
    console.log.apply(undefined, logArguments);
  };

  this.restartTimer = function() {
    startHrtime = process.hrtime();
  };

  this.start = function start() {
    this.restartTimer();
    this.log('%s', startSymbol);
  };

  this.changed = function start(filePaths) {
    this.restartTimer();
    this.log('%s %s', restartSymbol, formatPath(filePaths));
  };

  this.finished = function finished() {
    this.log('%s %s', stopSymbol, chalk.magenta('◷ ' + prettyHrtime(process.hrtime(startHrtime))));
  };

  this.error = function error(err) {
    this.log('%s', chalk.red.bold('✖ ' + err.message));
    this.finished();
  };

  this.restartTimer();

}

module.exports = Logger;

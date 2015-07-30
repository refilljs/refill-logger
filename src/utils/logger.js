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

function logger(name) {

  var startHrtime;

  function log(textTemplate) {
    var logArguments = Array.prototype.slice.call(arguments, 1);
    logArguments.unshift('%s %s %s ' + textTemplate, chalk.gray(moment().format('HH:mm')), prefix, chalk.cyan.bold(name));
    console.log.apply(undefined, logArguments);
  }

  function restartTimer() {
    startHrtime = process.hrtime();
  }

  function start() {
    restartTimer();
    log('%s', startSymbol);
  }

  function changed(filePaths) {
    restartTimer();
    log('%s %s', restartSymbol, formatPath(filePaths));
  }

  function finished() {
    log('%s %s', stopSymbol, chalk.magenta('◷ ' + prettyHrtime(process.hrtime(startHrtime))));
  }

  function error(err) {
    log('%s', chalk.red.bold('✖ ' + err.message));
    finished();
  }

  restartTimer();

  return {
    log: log,
    restartTimer: restartTimer,
    start: start,
    changed: changed,
    finished: finished,
    error: error
  };

}

module.exports = logger;

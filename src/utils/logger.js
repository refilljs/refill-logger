'use strict';

var chalk = require('chalk');
var _ = require('lodash');
var prettyHrtime = require('pretty-hrtime');
var path = require('path');
var util = require('util');

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

  function writePrefix() {
    process.stdout.write(util.format(' %s %s', logger.prefix, name));
  }

  function writeMultiLine(text, textWrapper, linePrefix) {
    text.split('\n').forEach(function(line) {
      writePrefix();
      console.log('%s%s', linePrefix, textWrapper(line));
    });
  }

  function info(text) {
    writeMultiLine(text, chalk.blue.bold, chalk.blue.bold(' ℹ '));
  }

  function error(err) {
    writeMultiLine(err.message.toString(), chalk.red.bold, chalk.red.bold(' ✖ '));
  }

  function restartTimer() {
    startHrtime = process.hrtime();
  }

  function start() {
    restartTimer();
    writePrefix();
    console.log(' %s', logger.startSymbol);
  }

  function changed(filePaths) {
    restartTimer();
    writePrefix();
    console.log(' %s %s %s', logger.restartSymbol, formatPath(filePaths), logger.startSymbol);
  }

  function finished() {
    writePrefix();
    console.log(' %s %s', logger.stopSymbol, chalk.magenta('◷ ' + prettyHrtime(process.hrtime(startHrtime))));
  }

  name = chalk.green(_.padRight(name + ' ', 12, '.'));

  restartTimer();

  return {
    info: info,
    error: error,
    restartTimer: restartTimer,
    start: start,
    changed: changed,
    finished: finished
  };

}

logger.prefix = chalk.green('◹');
logger.startSymbol = chalk.green('►');
logger.stopSymbol = chalk.green('▪');
logger.restartSymbol = chalk.green('↻');

module.exports = logger;

'use strict';

var chalk = require('chalk');
var map = require('lodash.map');
var padEnd = require('lodash.padend');
var prettyHrtime = require('pretty-hrtime');
var path = require('path');
var util = require('util');

function formatPath(filePaths) {

  var formattedPaths;

  if (typeof filePaths.path !== 'undefined') {
    filePaths = filePaths.path;
  }

  if (!Array.isArray(filePaths)) {
    filePaths = [filePaths];
  }

  formattedPaths = map(filePaths, function(filePath) {
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
      /* eslint-disable no-console */
      console.log('%s%s', linePrefix, textWrapper(line));
      /* eslint-enable no-console */
    });
  }

  function info(text) {
    writeMultiLine(text, chalk.blue, chalk.blue(' ℹ '));
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
    /* eslint-disable no-console */
    console.log(' %s', logger.startSymbol);
    /* eslint-enable no-console */
  }

  function changed(filePaths) {
    restartTimer();
    writePrefix();
    /* eslint-disable no-console */
    console.log(' %s %s %s', logger.restartSymbol, formatPath(filePaths), logger.startSymbol);
    /* eslint-enable no-console */
  }

  function finished() {
    writePrefix();
    /* eslint-disable no-console */
    console.log(' %s %s', logger.stopSymbol, chalk.magenta('◷ ' + prettyHrtime(process.hrtime(startHrtime))));
    /* eslint-enable no-console */
  }

  name = chalk.green(padEnd(name + ' ', 12, '.'));

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

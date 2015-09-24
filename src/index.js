'use strict';

var gulpZkflowUtils = {
  del: require('del'),
  globby: require('./utils/globby'),
  logger: require('./utils/logger'),
  promisify: require('./utils/promisify'),
  NextHandler: require('./utils/NextHandler')
};

module.exports = gulpZkflowUtils;

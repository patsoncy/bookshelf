const chalk = require('chalk');
const moment = require('moment');
const _ = require('lodash');

moment.locale('zh-cn');

function log(message, error = false) {
  if(typeof message !== 'string'){
    message = JSON.stringify(message);
  }
  let now = moment().format('YYYY/MM/DD HH:mm:ss') + ': ';
  if (error) {
    console.log(chalk.green(now)+ chalk.bgRedBright.bold(message));
    return;
  }
  console.log(chalk.green(now) + chalk.white(message));
}

function loge(message) {
  log(message, true);
}

function debounce(func, wait = 1000){
  return _.debounce(func, wait);
}

module.exports = {
  log,
  loge,
  debounce
};
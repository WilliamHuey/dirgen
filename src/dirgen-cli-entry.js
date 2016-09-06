'use strict';

//Check JavaScript environment before executing
if (typeof process === 'undefined') {
  console.error(`Not in a Node environment, can not advance with file and folder generation.`);
  if (typeof window !== 'undefined') {
    console.error('Most likely in a browser');
  }
}

module.exports = function dirgenCliEntry(execPath, fromCli) {

  return require('./dirgen-cli-commands')(execPath, fromCli);
};
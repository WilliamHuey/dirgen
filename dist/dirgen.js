'use strict';

console.time('timer');

var readline = require('readline'),
    fs = require('fs');

var previousValue = null;
var currentValue = null;

var rl = readline.createInterface({
  input: fs.createReadStream('/Users/williamhuey/Desktop/Coding/JavaScript/npm-modules/dirgen/dist/test.txt')
});

rl.on('line', function (line) {
  // console.log('current line is ', line);

  //Track every two lines to verify if the line could be determine
  //as a folder or a file type
  if (previousValue === null) {
    currentValue = line;
  } else {

    //

  }
});

console.timeEnd('timer');
// const execFile = require('child_process').execFile;
// const child = execFile('node', ['--version'], (error, stdout, stderr) => {
//   if (error) {
//     throw error;
//   }
//   console.log(stdout);
// });


var lab = exports.lab = require('lab').script();
var __ = require('hamjest');

var childProcess = require('child_process'),
  path = require('path');

lab.experiment('flag: --completion', function() {

var bin = path.resolve(__dirname, '../bin/'),
  cliEntry = bin + '/dirgen-cli-entry.js';

var execFileSync = childProcess.execFileSync;
var cli = execFileSync('/Users/williamhuey/Desktop/Coding/JavaScript/npm-modules/dirgen/bin/dirgen-cli-entry.js');

console.log("cli", cli.toString('utf8'));


//
// console.log("cli ", cli);

// cli.stdout.on('data', (data) => {
//   console.log('stdout:', data);
// });
// //
// cli.stderr.on('data', (data) => {
//   console.log('stderr:', data);
// });
// //
// cli.once('close', (data) => {
//   console.log('close: ', data);
// });

});
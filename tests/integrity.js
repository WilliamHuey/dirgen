'use strict'

//Native modules
var childProcess = require('child_process'),
  path = require('path');

//Vendor modules
var lab = exports.lab = require('lab').script(),
  __ = require('hamjest');

//Testing cli file as the entry point of the dirgen module
var bin = path.resolve(__dirname, '../bin/'),
  cliEntry = bin + '/dirgen-cli-entry.js';

console.log("cliEntry", cliEntry);



lab.test('with no commands or arguments triggers help', (done) => {

  console.log("with no commands");
  // console.log("process.env", process.env);

  var exec = require('child_process').exec;
  var ls = exec('node', ['../dirgen/bin/dirgen-cli-entry.js']);

  ls.stdout.on('data', (data) => {
    console.log('stdout: ${data}');
  });

  ls.stderr.on('data', (data) => {
    console.log('stderr: ${data}');
  });

  ls.on('close', (code) => {
    console.log('child process exited with code ${code}');
  });

  // var exec = childProcess.exec;
  // var cli = exec('node ../dirgen/bin/dirgen-cli-entry.js', function(error, stdout, stderr) {
  //   console.log("stdout", stdout);
  //   console.log("error", error);
  //   console.log("stderr", stderr);
  // });
  //
  // cli.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`);
  // });
  //
  // cli.stderr.on('data', (data) => {
  //   console.log(`stderr: ${data}`);
  // });
  //
  // cli.on('close', (data) => {
  //   console.log(`close: ${data}`);
  // });

    __.assertThat((1 + 1), __.equalTo(2));
    done();
});




// console.log("process.cwd(),", process.cwd());

//
// console.log("__dirname", __dirname);
//
// var exec = child.exec;
//
// var entry = exec("node " + bin + "/dirgen-cli-entry.js g ", function (error, stdout, stderr) {
//   // if you also want to change current process working directory:
//   console.log("error", error);
//   console.log("stdout", stdout);
//   console.log("stderr", stderr);
// });
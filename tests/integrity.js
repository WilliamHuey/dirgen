'use strict'

//Native modules
var childProcess = require('child_process'),
  path = require('path');

//Vendor modules
var lab = exports.lab = require('lab').script(),
  __ = require('hamjest');

lab.experiment('flag: --completion', function() {

//Testing cli file as the entry point of the dirgen module
var bin = path.resolve(__dirname, '../bin/'),
  cliEntry = bin + '/dirgen-cli-entry.js';

console.log("cliEntry", cliEntry);



lab.test('with no commands or arguments triggers help', (done) => {

  console.log("with no commands");

  console.log("proces.cwd()", process.cwd());

  console.log("__dirname", __dirname);

  //node ../lib/dirgen-cli-commands.js g agds dds
  var exec= childProcess.exec;
  var cli = exec(`node ${__dirname}/../bin/dirgen-cli-entry.js`, function(error, stdout, stderr) {
    console.log("error", error);
    console.log("stdout", stdout);
    console.log("stderr", stderr);
    // console.log("callback for execfile");

    // __.assertThat((1 + 1), __.equalTo(2));
    done();
  });

  // console.log("cli", cli.toString('utf8'));

  cli.stdout.on('data', (data) => {
    console.log('stdout:', data);
  });
  //
  cli.stderr.on('data', (data) => {
    console.log('stderr:', data);
  });
  //
  cli.once('close', (data) => {
    console.log('close: ', data);
  });



});



});
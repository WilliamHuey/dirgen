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

  var execFileSync = childProcess.execFileSync;
  var cli = execFileSync('/Users/williamhuey/Desktop/Coding/JavaScript/npm-modules/dirgen/bin/dirgen-cli-entry.js');

  console.log("cli", cli.toString('utf8'));


    __.assertThat((1 + 1), __.equalTo(2));
    done();
});


});
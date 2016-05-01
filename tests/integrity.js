'use strict'

//Native modules
var childProcess = require('child_process'),
  path = require('path');

//Vendor modules
var lab = exports.lab = require('lab').script(),
  __ = require('hamjest');

lab.experiment('Cli commands when input is "dirgen" and', function() {

  var exec = childProcess.exec;

  lab.experiment('with no commands or arguments', function() {
    lab.test('triggers help message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });
  });



  lab.experiment('and with the generate command', function() {

    lab.test('and no arguments triggers error message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js generate', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('No file template nor folder destination given.'));
        done(error);
      });
    });
  });



  /*
    'with generate command and invalid template file but no destination folder triggers error message'

    'with generate command and invalid template file but valid destination folder triggers error message'

    'with generate command and invalid template file but invalid destination folder triggers error message'

    'with generate command and valid template file but no destination folder triggers error message'

    'with generate command and valid template file but valid destination folder triggers no error message'

    'with generate command and valid template file but invalid destination folder triggers error message'



  */


});

lab.experiment('On valid cli commands and arguments', function() {

  /*
    'with "demo" command will create the example folder'

    'with "demo" command will create the files and folders that will match the demo template file'

    'with'
  */

});
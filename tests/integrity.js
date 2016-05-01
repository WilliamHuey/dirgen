'use strict'

//Native modules
var childProcess = require('child_process'),
  path = require('path');

//Vendor modules
var lab = exports.lab = require('lab').script(),
  __ = require('hamjest');

lab.experiment('Cli commands when input is "dirgen" and', function() {

  var exec = childProcess.exec;

  lab.experiment.skip('with no commands or options', function() {
    lab.test('will display the help message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });
  });


  lab.experiment.skip('and with the generate command', function() {

    lab.test('and no arguments displays an error message', function(done) {

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

  lab.experiment('and with information commands', function() {

    lab.test('with help command will display the help message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js help', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });

    lab.test('with help alias command, "h", will display the help message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js h', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });

    lab.test('with help alias option , "--help" will display the help message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js --help', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });

    lab.test('with version command produces the same version number as in the package.json file', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js version', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString(process.env.npm_package_version));
        done(error);
      });
    });

    lab.test('with version command will display the module information message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js version', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Dirgen v'));
        done(error);
      });
    });

    lab.test('with version alias command, "v", will display the module information message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js v', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Dirgen v'));
        done(error);
      });
    });

    lab.test('with version alias option , "--version" will display the module information message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js --version', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Dirgen v'));
        done(error);
      });
    });

    /*
      'with "demo" command will create the example folder'

      'with "demo" command will create the files and folders that will match the demo template file'


    */

  });

  /*

  alias for the commands
  generation console time
  error messages for file generation
  file integrity checks
  */



});


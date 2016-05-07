'use strict'

//Native modules
var childProcess = require('child_process'),
  path = require('path');

//Vendor modules
var fs = require('fs-extra-promise');
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

    lab.test('with generate command, and with no arguments will display the error message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js generate', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('No file template nor folder destination given.'));
        done(error);
      });
    });

    lab.test('using alias command, "g", and with no arguments will display an error message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js g', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('No file template nor folder destination given.'));
        done(error);
      });
    });

    lab.test('using alias command, "gen", and with no arguments will display an error message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js gen', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('No file template nor folder destination given.'));
        done(error);
      });
    });

    lab.test('with generate command and invalid template file but no destination folder will display error message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js generate //', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('No folder destination given in second command input.'));
        done(error);
      });
    });

    lab.test('with generate command and invalid template file but valid destination folder will display error message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js generate /zzz ../demo', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Not a valid file. Need a plain text file format in the first'));
        done(error);
      });
    });

    lab.test('with generate command and invalid template file and invalid destination folder will display error message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js generate /zzz ../adsf', function(error, stdout, stderr) {

        __.assertThat(stdout, __.containsString('Not a valid file. Need a plain text file format in the first'));
        done(error);
      });
    });

    lab.test('with generate command and valid template file but no destination folder will display error message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js generate ../demo/example.txt', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('No folder destination given in second command input.'));
        done(error);
      });
    });

    lab.test('with generate command and valid template file but invalid destination folder will display error message', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js generate ' + __dirname + '/../demo/example.txt ../adscd', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Not a valid folder.'));
        done(error);
      });
    });



  });


  /*
    //use the demo test to verify the workings of an actual successful generation
    'with generate command and valid template file and valid destination folder will display no error message'

  */

  lab.experiment('and with demo and information commands', function() {

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

        var packageJsonPath = path.resolve(__dirname, '../package.json');

        var versionNumber = require(packageJsonPath).version.replace(/version /i, '');

        __.assertThat(stdout, __.containsString(versionNumber));
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

      });
    });

    lab.test('with "demo" command will create the example folder', function(done) {

      exec('node ' + __dirname +  '/../bin/dirgen-cli-entry.js demo', function(error, stdout, stderr) {

        fs.isDirectoryAsync(__dirname + '/../demo/example-output').then(function(resolve, error) {
          __.assertThat(error, __.is( __.undefined()));
          done(error);
        }, function(error) {
          __.assertThat(error, __.is( __.not(__.defined())));
          done(error);
        });

      });
    });

    /*


      'with "demo" command will create the files and folders that will match the demo template file'


    */

  });

  /*

  demo command
  generation console time
  error messages for file generation
  file integrity checks
    -number of file and folder count is the same as the number of items in the file
    -name and type should reflect the file after sanitization

  */



});


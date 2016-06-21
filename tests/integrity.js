'use strict'

//Native modules
var childProcess = require('child_process'),
  path = require('path');

//Vendor modules
var fs = require('fs-extra-promise'),
  lab = exports.lab = require('lab').script(),
  __ = require('hamjest');

//Path definitions
var cliEntryFile = 'node ' + __dirname +  '/../bin/dirgen-cli-init.js';

lab.experiment('Cli commands when input is "dirgen"', function() {

  var exec = childProcess.exec;

  lab.experiment.skip('and with no commands or options', function() {
    lab.test('will display the help message', function(done) {
      exec(cliEntryFile, function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });
  });

  lab.experiment.skip('and with the generate command', function() {

    lab.test('and no arguments displays an error message', function(done) {
      exec(cliEntryFile + ' generate', function(error, stdout, stderr) {
        __.assertThat(stdout,
          __.containsString('No file template nor folder destination given.'));
        done(error);
      });
    });

    lab.test('and no arguments, will display the error message', function(done) {
      exec(cliEntryFile + ' generate', function(error, stdout, stderr) {
        __.assertThat(stdout,
          __.containsString('No file template nor folder destination given.'));
        done(error);
      });
    });

    lab.test('using alias command, "g", and no arguments, will display the error message', function(done) {
      exec(cliEntryFile + ' g', function(error, stdout, stderr) {
        __.assertThat(stdout,
          __.containsString('No file template nor folder destination given.'));
        done(error);
      });
    });

    lab.test('using alias command, "gen", and with no arguments will display an error message', function(done) {
      exec(cliEntryFile + ' gen', function(error, stdout, stderr) {
        __.assertThat(stdout,
          __.containsString('No file template nor folder destination given.'));
        done(error);
      });
    });

    lab.test('and invalid template file but no destination folder will display error message', function(done) {
      exec(cliEntryFile + ' generate //', function(error, stdout, stderr) {
        __.assertThat(stdout,
          __.containsString('No folder destination given in second command input.'));
        done(error);
      });
    });

    lab.test('and invalid template file but valid destination folder will display error message', function(done) {
      exec(cliEntryFile + ' generate /zzz ../demo', function(error, stdout, stderr) {
        __.assertThat(stdout,
          __.containsString('Not a valid file. Need a plain text file format in the first'));
        done(error);
      });
    });

    lab.test('and invalid template file and invalid destination folder will display error message', function(done) {
      exec(cliEntryFile + ' generate /zzz ../adsf', function(error, stdout, stderr) {
        __.assertThat(stdout,
          __.containsString('Not a valid file. Need a plain text file format in the first'));
        done(error);
      });
    });

    lab.test('and valid template file but no destination folder will display error message', function(done) {
      exec(cliEntryFile + ' generate ../demo/example.txt', function(error, stdout, stderr) {
        __.assertThat(stdout,
          __.containsString('No folder destination given in second command input.'));
        done(error);
      });
    });

    lab.test('and valid template file but invalid destination folder will display error message', function(done) {
      exec(cliEntryFile + ' generate ' + __dirname + '/../demo/example.txt ../adscd', function(error, stdout, stderr) {
        __.assertThat(stdout,
          __.containsString('Not a valid folder.'));
        done(error);
      });
    });

  });


  /*
    //use the demo test to verify the workings of an actual successful generation
    'and valid template file and valid destination folder will display no error message'

  */

  lab.experiment.skip('and with the information commands', function() {

    lab.test('with help command will display the help message', function(done) {
      exec(cliEntryFile + ' help', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });

    lab.test('with help alias command, "h", will display the help message', function(done) {
      exec(cliEntryFile + ' h', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });

    lab.test('with help alias option , "--help" will display the help message', function(done) {
      exec(cliEntryFile + ' --help', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });

    lab.test('with help alias option , "-h" will display the help message', function(done) {
      exec(cliEntryFile + ' -h', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });

    lab.test('with version command produces the same version number as in the package.json file', function(done) {
      exec(cliEntryFile + ' version', function(error, stdout, stderr) {

        var packageJsonPath = path.resolve(__dirname, '../package.json'),
          versionNumber = require(packageJsonPath).version
                            .replace(/version /i, '');

        __.assertThat(stdout, __.containsString(versionNumber));
        done(error);
      });
    });

    lab.test('with version command will display the module information message', function(done) {
      exec(cliEntryFile + ' version', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Dirgen v'));
        done(error);
      });
    });

    lab.test('with version alias command, "v", will display the module information message', function(done) {
      exec(cliEntryFile + ' v', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Dirgen v'));
        done(error);
      });
    });

    lab.test('with version alias option , "--version" will display the module information message', function(done) {
      exec(cliEntryFile + ' --version', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Dirgen v'));
        done(error);
      });
    });

    lab.test('with version alias option , "-v" will display the module information message', function(done) {
      exec(cliEntryFile + ' -v', function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Dirgen v'));
        done(error);
      });
    });
  });

lab.experiment.skip('and with the demo command', function() {
  lab.test('with "demo" command will create the example folder', function(done) {
    exec(cliEntryFile + ' demo', function(error, stdout, stderr) {

      fs.isDirectoryAsync(__dirname + '/../demo/example-output').then(function(resolve, error) {
        __.assertThat(error, __.is( __.undefined()));
        done(error);
      }, function(error) {
        __.assertThat(error, __.is( __.not(__.defined())));
        done(error);
      });

    });
  });

  lab.test('with "demo" command after successfully created files and folders, will log out the generation time', function(done) {

    exec(cliEntryFile + ' demo', function(error, stdout, stderr) {
      __.assertThat(stdout, __.containsString('Write time'));
      done(error);
    });
  });

  lab.test('with "demo" command will create the files and folders that will match the demo template file', function(done) {
    exec(cliEntryFile + ' demo', function(error, stdout, stderr) {
      var readType = {
        file: 'existsAsync',
        folder: 'isDirectoryAsync'
      }

      var expectedDemoPaths = require(path.resolve(__dirname +  '/fixtures/demo-structure-output.js'));

      var keyCount = Object.keys(expectedDemoPaths).length;
      var structureCheckCount = 0;
      var doneCheck = function(keyCount, structureCheckCount, done, error) {
        if(keyCount === structureCheckCount) {
          done(error);
        }
      }

      for (var key in expectedDemoPaths) {

        //File defined in fixture sanity check
        __.assertThat(expectedDemoPaths[key], __.is( __.not(__.undefined())));

        //Check the file type of the structure
        fs[readType[expectedDemoPaths[key]]](__dirname + '/../demo' + key ).then(function(resolve, error) {
          structureCheckCount++;
          __.assertThat(error, __.is( __.undefined()));
          doneCheck(keyCount, structureCheckCount, done, error);
        }, function(error) {
          structureCheckCount++;
          __.assertThat(error, __.is( __.not(__.defined())));
          doneCheck(keyCount, structureCheckCount, done, error)
        })
      }
    });
  });

});


  /*

  file generate
  file integrity checks
    -number of file and folder count is the same as the number of items in the file
    -name and type should reflect the file after sanitization
    -nesting checks

  */
  lab.experiment('and with the generate command scenarios', function() {

    lab.beforeEach(function (done) {
      exec('rm -rf ' +  __dirname  + '/case-outputs/*', function() {
        done();
      });
    });

    lab.after(function (done) {
      exec('rm -rf ' +  __dirname  + '/case-outputs/*', function() {
        done();
      });
    });

    lab.test('and file sanitizing replacing only one slash will display a generation time', function(done) {

      fs.mkdirAsync(__dirname + '/case-outputs/one-slash')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/one-slash.txt' + ' tests/case-outputs/one-slash', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('Write time'));
          done(error);
        });
      }, function(error) {
        done(error);
      });
    });

    lab.test('and file sanitizing with additional slashes in front will default to a folder and will display a warning message', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/more-than-one-slash')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/more-than-one-slash.txt' + ' tests/case-outputs/more-than-one-slash', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('has illegal characters which has'));

          fs.isDirectoryAsync( __dirname + '/case-outputs/more-than-one-slash/slashesinexcess')
          .then(function(resolve, error) {
            __.assertThat(error, __.is( __.undefined()));

            done(error);
          }, function(error) {
            __.assertThat(error, __.is( __.not(__.defined())));
          });
        });
      }, function(error) {
        done(error);
      });
    });

    //TODO: Make it pass later
    lab.test.skip('and file sanitizing with problematic names for oses will display a warning message', function(done) {

      var problematicCases = 0;

      exec('ls ' + __dirname + '/fixtures/problematic*', function(error, stdout, stderr) {

        var modulePath = new RegExp(__dirname + '/fixtures' ,"g");
        var testFilesPaths = stdout.replace(modulePath, '').split('\n');

        //Remove the blank entry in the array
        testFilesPaths.pop();

        testFilesPaths.forEach(function(testCasePath) {

          var genTestFolder = path.resolve('tests/case-outputs/' +  testCasePath).replace(/.txt/i, '');

          fs.mkdirAsync(genTestFolder)
          .then(function() {

            exec(cliEntryFile + ' g ' + 'tests/fixtures' +  testCasePath + ' ' + genTestFolder, function(error, stdout, stderr) {
              problematicCases += 1;
              __.assertThat(stdout,
                __.containsString('has illegal characters which has'));

              if(testFilesPaths.length == problematicCases) {

                fs.statAsync(genTestFolder + '/valid', function(error, stat) {
                  if (error == null) {
                    __.assertThat(error, __.is(__.falsy()))
                    done(error);
                  } else if (error.code == 'ENOENT') {
                    __.assertThat(error, __.is( __.defined()));
                    done(error);
                  } else {
                    __.assertThat(error, __.is( __.defined()));
                    done(error);
                  }
                });
              }
            })
          });
        });
      });
    });

    lab.test('and with repeated lines in the same level will display a warning message', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/repeated-lines-same-level')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/repeated-lines-same-level.txt ' +
        ' tests/case-outputs/repeated-lines-same-level', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('repeated line'));

          fs.statAsync(__dirname + '/case-outputs/repeated-lines-same-level/afadsfsf', function(error, stat) {
            if (error == null) {
              __.assertThat(error, __.is(__.falsy()))
              done(error);
            } else if (error.code == 'ENOENT') {
              __.assertThat(error, __.is( __.defined()));
              done(error);
            } else {
              __.assertThat(error, __.is( __.defined()));
              done(error);
            }
          });
        });
      });
    });

    lab.test('and with a repeated top level line will display a warning message noting the first of the repeats', function(done) {

      fs.mkdirAsync(__dirname + '/case-outputs/child-of-repeated-parent')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/child-of-repeated-parent.txt ' +
        ' tests/case-outputs/child-of-repeated-parent', function(error, stdout, stderr) {

          __.assertThat(stdout,
            __.containsString("Line #5: 'gsdf', of folder type is a repeated line and"));

          __.assertThat(stdout,
            __.containsString("on line #1"));

          done();
        });
      });
    });

    lab.test('and with mixing indent type of spaces and tabs will display an error message', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/mix-tabs-and-spaces-indent')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/mix-tabs-and-spaces-indent.txt ' +
        ' tests/case-outputs/mix-tabs-and-spaces-indent', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('with the first defined outdent'));
          done(error);
        });
      });
    });

    lab.test('and with inconsistent indent scaling factor will display an error message', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/inconsistent-indent')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/inconsistent-indent.txt ' +
        ' tests/case-outputs/inconsistent-indent', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('different from the first defined indent amount'));
          done(error);
        });
      });
    });

    lab.test('and with inconsistent outdent scaling factor will display an error message', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/inconsistent-outdent')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/inconsistent-outdent.txt ' +
        ' tests/case-outputs/inconsistent-outdent', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('indented than the current line. Ambigious results might occur.'));
          done(error);
        });
      });
    });

    lab.test('and with length of name of file or folder exceeding 255 characters will display an error message', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/length-greater-than-255')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/length-greater-than-255.txt ' +
        ' tests/case-outputs/length-greater-than-255', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('which exceeds 255.'));
          done(error);
        });
      });
    });

    lab.test('and with nothing in a template file will display an error message', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/nothing-in-template')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/nothing-in-template.txt ' +
        ' tests/case-outputs/nothing-in-template', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('Supplied template file has no content to generate'));
          done(error);
        });
      });
    });
  });

  lab.experiment.skip('and for file safety check', function() {

    lab.after(function (done) {
      exec('rm -rf ' +  __dirname  + '/case-outputs/*', function() {
        done();
      });
    });

    lab.test('should not wipe out existing files in a folder', function(done) {

      fs.mkdirAsync(__dirname + '/case-outputs/not-wipe-out-existing')
      .then(function() {
        fs.ensureDirAsync(__dirname + '/case-outputs/not-wipe-out-existing/four')
        .then(function(resolve, error) {
          exec(cliEntryFile + ' g ' + 'tests/fixtures/not-wipe-out-existing.txt ' +
          ' tests/case-outputs/not-wipe-out-existing', function(error, stdout, stderr) {

            fs.isDirectoryAsync(__dirname + '/case-outputs/not-wipe-out-existing/four')
            .then(function(resolve, error) {

              __.assertThat(error, __.is( __.undefined()));
              done(error);
            });

          });
        });
      });

    });
  });

});
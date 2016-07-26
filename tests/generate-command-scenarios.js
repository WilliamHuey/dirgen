module.exports = function(__, lab, cliEntryFile, exec, fs, path) {
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

    lab.test('and file sanitizing with problematic names for oses will display a warning message', function(done) {

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

      fs.mkdirAsync(__dirname + '/case-outputs/top-level-repeated-line')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/top-level-repeated-line.txt ' +
        ' tests/case-outputs/top-level-repeated-line', function(error, stdout, stderr) {

          __.assertThat(stdout,
            __.containsString("Line #5: 'gsdf', of folder type is a repeated line and"));

          __.assertThat(stdout,
            __.containsString("on line #1"));

          done();
        });
      });
    });

    lab.test('and with a repeated non-top child line of a parent folder will display a warning message noting the first of the repeats', function(done) {

      fs.mkdirAsync(__dirname + '/case-outputs/child-of-repeated-parent')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/child-of-repeated-parent.txt ' +
        ' tests/case-outputs/child-of-repeated-parent', function(error, stdout, stderr) {

          __.assertThat(stdout,
            __.containsString("Line #4: 'adsfadfasdf', of folder type is a repeated line and"));

          __.assertThat(stdout,
            __.containsString("First appearance of"));

          __.assertThat(stdout,
            __.containsString("is on line #2"));

          done();
        });
      });
    });

    lab.test('and with a repeated non-top child line of a repeated parent folder will not display a warning message for the repeated children', function(done) {

      fs.mkdirAsync(__dirname + '/case-outputs/repeated-child-of-repeated-parent')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/repeated-child-of-repeated-parent.txt ' +
        ' tests/case-outputs/repeated-child-of-repeated-parent', function(error, stdout, stderr) {

          __.assertThat(stdout,
            __.not(__.containsString("Line #5: 'adsfadfasdf', of folder type is a repeated line and")));

          __.assertThat(stdout,
            __.not(__.containsString("Line #6: 'adsfadfasdf', of folder type is a repeated line and")));

          done();
        });
      });
    });

    lab.test('and with mixing indent type of spaces and tabs on different lines will display an error message', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/mix-tabs-and-spaces-indent')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/mix-tabs-and-spaces-indent.txt ' +
        ' tests/case-outputs/mix-tabs-and-spaces-indent', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('with the first defined outdent'));

          __.assertThat(stdout,
            __.containsString('0 generated'));

          done(error);
        });
      });
    });

    lab.test('and with mixing indent type of spaces and tabs on the same line will display an error message', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/same-line-mix-tabs-and-spaces-indent')
      .then(function() {
        exec(cliEntryFile + ' g ' + 'tests/fixtures/same-line-mix-tabs-and-spaces-indent.txt ' +
        ' tests/case-outputs/same-line-mix-tabs-and-spaces-indent', function(error, stdout, stderr) {
          __.assertThat(stdout,
            __.containsString('has mixed tabs and spaces on the left of first'));

          __.assertThat(stdout,
            __.containsString('0 generated'));

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

          __.assertThat(stdout,
            __.containsString('0 generated'));

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

          __.assertThat(stdout,
            __.containsString('0 generated'));

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

          __.assertThat(stdout,
            __.containsString('0 generated'));

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

          __.assertThat(stdout,
            __.containsString('0 generated'));

          done(error);
        });
      });
    });
  });

};
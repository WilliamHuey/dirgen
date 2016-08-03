module.exports = function(__, lab, cliEntryFile, exec, fs) {
  lab.experiment('and for display messages', function() {

    lab.after(function (done) {
      exec('rm -rf ' +  __dirname  + '/case-outputs/*', function() {
        done();
      });
    });

    lab.test('with warning messages and no silent flag will show console warnings', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/warnings-no-silent-flag')
      .then(function() {

        exec(cliEntryFile + ' g ' +
        'tests/fixtures/warnings-no-silent-flag.txt ' +
        ' tests/case-outputs/warnings-no-silent-flag', function(error, stdout, stderr) {
            __.assertThat(stdout, __.containsString('Warning:'));
          done();
        });
      });
    });

    lab.test('with warning messages and with silent flag will not show console warnings', function(done) {
      fs.mkdirAsync(__dirname + '/case-outputs/warnings-with-silent-flag')
      .then(function() {

        exec(cliEntryFile + ' g ' +
        'tests/fixtures/warnings-with-silent-flag.txt ' +
        ' tests/case-outputs/warnings-with-silent-flag -s', function(error, stdout, stderr) {
            __.assertThat(stdout, __.not(__.containsString('Warning:')));
          done();
        });
      });
    });

    lab.test('with error messages and no silent flag will show console warnings', function(done) {
      done();
    });

    lab.test('with error messages and with silent flag will not show console warnings', function(done) {
      done();
    });

    lab.test('with warning and error messages and no silent flag will show console warnings', function(done) {
      done();
    });

    lab.test('with warning and error messages and with silent flag will not show console warnings', function(done) {
      done();
    });


  });
};
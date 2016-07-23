module.exports = function(__, lab, cliEntryFile, exec, fs, path) {
  lab.experiment('and for file safety check', function() {

    lab.after(function (done) {
      exec('rm -rf ' +  __dirname  + '/case-outputs/*', function() {
        done();
      });
    });

    lab.test('should not wipe out existing files in a folder with no overwrite flag as default behavior', function(done) {

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


    lab.test('should not wipe out existing folders with no overwrite flag as default behavior', function(done) {

      done();
    });

    lab.test('should wipe out existing files in a folder with overwrite flag, -f', function(done) {

      done();
    });

    lab.test('should wipe out existing folders with overwrite flag, -f', function(done) {

      done();
    });


  });

};
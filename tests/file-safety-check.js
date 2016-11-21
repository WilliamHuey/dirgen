module.exports = function(__, lab, cliEntryFile, exec, fs, path) {
  lab.experiment('and for file safety check', function() {

    lab.after(function (done) {
      exec('rm -rf ' +  __dirname  + '/case-outputs/*', function() {
        done();
      });
    });

    lab.test('should not wipe out existing file in a folder when not matching content in template file', function(done) {

      fs.mkdirAsync(__dirname + '/case-outputs/not-wipe-out-existing-file')
      .then(function() {
        fs.writeFileAsync(__dirname + '/case-outputs/not-wipe-out-existing-file/four', '')
        .then(function(resolve, error) {
          exec(cliEntryFile + ' g ' + 'tests/fixtures/not-wipe-out-existing-file.txt ' +
          ' tests/case-outputs/not-wipe-out-existing-file', function(error, stdout, stderr) {

            fs.existsAsync(__dirname + '/case-outputs/not-wipe-out-existing-file/four')
            .then(function(resolve, error) {

              __.assertThat(error, __.is( __.undefined()));
              done(error);
            });

          });
        });
      });

    });

    lab.test('should not wipe out existing file in a folder when matching content in template file', function(done) {

      fs.mkdirAsync(__dirname + '/case-outputs/not-wipe-out-existing-file-matching')
      .then(function() {
        fs.writeFileAsync(__dirname + '/case-outputs/not-wipe-out-existing-file-matching/three', '')
        .then(function(resolve, error) {
          exec(cliEntryFile + ' g ' + 'tests/fixtures/not-wipe-out-existing-file.txt ' +
          ' tests/case-outputs/not-wipe-out-existing-file-matching', function(error, stdout, stderr) {

            fs.existsAsync(__dirname + '/case-outputs/not-wipe-out-existing-file-matching/three')
            .then(function(resolve, error) {

              __.assertThat(error, __.is( __.undefined()));
              done(error);
            });

          });
        });
      });

    });

    lab.test('should not wipe out existing folder with no overwrite flag', function(done) {

      //Create the initial folder
      fs.mkdirAsync(__dirname + '/case-outputs/not-wipe-out-existing-folder')
      .then(function(stats, err) {

        //Run the generation script two times
        //and see if the folder was skipped on the second time
        exec(cliEntryFile + ' g ' + 'tests/fixtures/not-wipe-out-existing-folder.txt ' +
        ' tests/case-outputs/not-wipe-out-existing-folder', function(error, stdout, stderr) {

          exec(cliEntryFile + ' g ' + 'tests/fixtures/not-wipe-out-existing-folder.txt ' +
          ' tests/case-outputs/not-wipe-out-existing-folder', function(error, stdout, stderr) {
            __.assertThat(stdout, __.containsString('1 skipped'));
            done();
          });

        });
      });

    });

    lab.test('should wipe out existing file in a folder with overwrite flag, -f', function(done) {

      //Create the initial folder
      fs.mkdirAsync(__dirname + '/case-outputs/wipe-out-existing-file')
      .then(function(stats, err) {

        //Run the generation script two times
        //and see if the file was overwritten on the second time
        exec(cliEntryFile + ' g ' + 'tests/fixtures/wipe-out-existing-file.txt ' +
        ' tests/case-outputs/wipe-out-existing-file', function(error, stdout, stderr) {

          exec(cliEntryFile + ' g ' + 'tests/fixtures/wipe-out-existing-file.txt ' +
          ' tests/case-outputs/wipe-out-existing-file -f', function(error, stdout, stderr) {
            __.assertThat(stdout, __.containsString('1 generated'));
            done();
          });

        });
      });

    });

    lab.test('should wipe out existing folder in a folder with overwrite flag, -f', function(done) {

      //Create the initial folder
      fs.mkdirAsync(__dirname + '/case-outputs/wipe-out-existing-folder')
      .then(function(stats, err) {

        //Run the generation script two times
        //and see if the file was overwritten on the second time
        exec(cliEntryFile + ' g ' + 'tests/fixtures/wipe-out-existing-folder.txt ' +
        ' tests/case-outputs/wipe-out-existing-folder', function(error, stdout, stderr) {

          exec(cliEntryFile + ' g ' + 'tests/fixtures/wipe-out-existing-folder.txt ' +
          ' tests/case-outputs/wipe-out-existing-folder -f', function(error, stdout, stderr) {

            __.assertThat(stdout, __.containsString('1 generated'));
            done();
          });

        });
      });

    });

  });
};
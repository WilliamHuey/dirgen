module.exports = function(__, lab, cliEntryFile, exec, fs, path) {
  lab.experiment('and for file safety check', function() {

    lab.after(function (done) {
      exec('rm -rf ' +  __dirname  + '/case-outputs/*', function() {
        done();
      });
    });

    lab.test('should not wipe out existing folder in a folder with no overwrite flag as default behavior', function(done) {

      fs.mkdirAsync(__dirname + '/case-outputs/not-wipe-out-existing-folder-in-folder')
      .then(function() {
        fs.ensureDirAsync(__dirname + '/case-outputs/not-wipe-out-existing-folder-in-folder/four')
        .then(function(resolve, error) {
          exec(cliEntryFile + ' g ' + 'tests/fixtures/not-wipe-out-existing-folder-in-folder.txt ' +
          ' tests/case-outputs/not-wipe-out-existing-folder-in-folder', function(error, stdout, stderr) {

            fs.isDirectoryAsync(__dirname + '/case-outputs/not-wipe-out-existing-folder-in-folder/four')
            .then(function(resolve, error) {

              __.assertThat(error, __.is( __.undefined()));
              done(error);
            });

          });
        });
      });

    });


    lab.test('should not wipe out existing folders with no overwrite flag as default behavior', function(done) {

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

    lab.test('should wipe out existing files in a folder with overwrite flag, -f', function(done) {

      //Create the initial folder

      //Save the time of creation

      //Run the generation script

      //Check the modified date of the
      //file of interest, which should have a different time stamp than the saved time stamp

      done();
    });

    lab.test('should wipe out existing folders with overwrite flag, -f', function(done) {

      //Create the initial folder

      //Save the time of creation

      //Run the generation script

      //Check the modified date of the
      //folder of interest, which should have a different time stamp than the saved time stamp

      done();
    });


  });
};
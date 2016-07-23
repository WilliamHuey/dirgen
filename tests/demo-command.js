module.exports = function(__, lab, cliEntryFile, exec, fs, path) {
  lab.experiment('and with the demo command', function() {
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

};
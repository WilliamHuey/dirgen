module.exports = function(__, lab, cliEntryFile, exec) {
  lab.experiment('and with the generate command', function() {

    lab.test('and no arguments, will display an error message', function(done) {
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

};
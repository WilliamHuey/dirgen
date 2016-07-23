module.exports = function(__, lab, cliEntryFile, exec, validCliCommands, path) {
  lab.experiment('and with the information commands', function() {

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

    lab.test('with an invalid command, will produce a warning message', function(done) {
      exec(cliEntryFile + ' afsdjkafgls', function(error, stdout, stderr) {

        __.assertThat(validCliCommands.commands, __.not(__.hasItem('afsdjkafgls')));

        __.assertThat(validCliCommands.asyncCommands, __.not(__.hasItem('afsdjkafgls')));

        __.assertThat(stdout, __.containsString("is not a recognized command. Type 'dirgen --help' for a list of commands."));
        done(error);
      });
    });
  });

};
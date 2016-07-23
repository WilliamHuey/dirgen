module.exports = function(__, lab, cliEntryFile, exec) {
  lab.experiment('and with no commands or options', function() {
    lab.test('will display the help message', function(done) {
      exec(cliEntryFile, function(error, stdout, stderr) {
        __.assertThat(stdout, __.containsString('Description'));
        done(error);
      });
    });
  });
}



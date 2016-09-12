module.exports = function(__, lab, cliEntryFile, exec, fs, path) {

  lab.after(function (done) {
    exec('rm -rf ' +  __dirname  + '/case-outputs/*', function() {
      done();
    });
  });

  lab.before(function (done) {
    exec('rm -rf ' +  __dirname  + '/case-outputs/*', function() {
      done();
    });
  });

  lab.experiment('checking for input configuration', function() {

    var dirgenCliEntry = __dirname +  '/../bin/dirgen-cli-entry.js';
    var fixtureDir = __dirname +  '/fixtures';


    lab.test('will not error out with valid template file and output directory', function(done) {

      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/not-error-out-valid-template-and-output-directory'))
      .then(function() {

        dirgen
          .generate({
            template: (fixtureDir + '/top-level-repeated-line.txt'),
            output: (__dirname + '/case-outputs/not-error-out-valid-template-and-output-directory'),
            options: { hideMessages: true }
          })
          .on({
            done: function(results) {
              __.assertThat(results.errors, __.hasSize(0));
              done();
            }
          });
      });

    });

    lab.test('will error out with invalid template file',
    function(done) {

      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/does-not-exists'))
      .then(function() {

        try {
          dirgen
            .generate({
              template: (fixtureDir + '/zzz.txt'),
              output: (__dirname + '/case-outputs/does-not-exists'),
              options: { hideMessages: true }
            })
            .on({
              done: function(results) {
                __.assertThat(results.errors, __.hasSize(1));
                done();
              }
            });
        } catch (error) {
          console.log(error);
        }

      });
    });


    lab.test('will error out with invalid output directory', function(done) {

      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/error-out-with-invalid-directory'))
      .then(function() {

        dirgen
          .generate({
            template: (fixtureDir + '/one-slash.txt'),
            output: (__dirname + '/case-outputs/error-out-with-invalid-directory/nothing'),
            options: { hideMessages: true }
          })
          .on({
            done: function(results) {
              __.assertThat(results.errors, __.hasSize(1));
              done();
            }
          });
      });

    });


    lab.test('will not error out without any "options" defined ', function(done) {
      done();
    });

    lab.test('will not error out with valid option "force"', function(done) {
      done();
    });

    lab.test('will not error out with valid boolean value for "force"', function(done) {
      done();
    });

    lab.test('will error out with invalid non-boolean value for "force"', function(done) {
      done();
    });

    lab.test('will not error with valid option "silent"',
    function(done) {
      done();
    });

    lab.test('will error out with invalid non-boolean value for "silent"', function(done) {
      done();
    });

    lab.test('will error out with only the options key, no "template" or "output" key',
    function(done) {
      done();
    });

  });


};
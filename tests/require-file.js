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

        dirgen({
          template: (fixtureDir + '/top-level-repeated-line.txt'),
          output: (__dirname + '/case-outputs/not-error-out-valid-template-and-output-directory'),
          on: {
            done: function(results) {
              __.assertThat(results.errors, __.hasSize(0));
              done();
            }
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
          dirgen({
            template: (fixtureDir + '/zzz.txt'),
            output: (__dirname + '/case-outputs/does-not-exists'),
            options: { hideMessages: true },
            on: {
              done: function(results) {
                __.assertThat(results.errors, __.hasSize(1));
                done();
              }
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

        dirgen({
          template: (fixtureDir + '/one-slash.txt'),
          output: (__dirname + '/case-outputs/error-out-with-invalid-directory/nothing'),
          options: { hideMessages: true },
          on: {
            done: function(results) {
              __.assertThat(results.errors, __.hasSize(1));
              done();
            }
          }
        });
      });
    });

    lab.test('will not error out without any "options" defined', function(done) {
      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/not-error-out-valid-template-and-output-directory-no-options'))
      .then(function() {

        dirgen({
          template: (fixtureDir + '/top-level-repeated-line.txt'),
          output: (__dirname + '/case-outputs/not-error-out-valid-template-and-output-directory-no-options'),
          on: {
            done: function(results) {
              __.assertThat(results.errors, __.hasSize(0));
              done();
            }
          }
        });

      });
    });

    lab.test('will not error out with valid option "force"', function(done) {
      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/not-error-out-valid-template-and-output-directory-with-valid-force-option'))
      .then(function() {

        dirgen({
          template: (fixtureDir + '/one-slash.txt'),
          output: (__dirname + '/case-outputs/not-error-out-valid-template-and-output-directory-with-valid-force-option'),
          options: { forceOverwrite: true },
          on: {
            done: (results) => {
              __.assertThat(results.errors, __.isEmpty());
              done();
            }
          }
        });

      });
    });

    lab.test('will error out with invalid non-boolean value for "force"', function(done) {
      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/error-out-valid-template-and-output-directory-with-invalid-force-option'))
      .then(function() {

        dirgen({
            template: (fixtureDir + '/one-slash.txt'),
            output: (__dirname + '/case-outputs/error-out-valid-template-and-output-directory-with-invalid-force-option'),
            options: { forceOverwrite: 'vvzxg' },
            on: {
              done: (results) => {
                __.assertThat(results.errors, __.hasSize(1));
                done();
              }
            }
          });
      });

    });

    lab.test('will error out with invalid non-boolean value for "silent"', function(done) {
      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/error-out-valid-template-and-output-directory-with-invalid-silent-option'))
      .then(function() {

        dirgen({
            template: (fixtureDir + '/one-slash.txt'),
            output: (__dirname + '/case-outputs/error-out-valid-template-and-output-directory-with-invalid-silent-option'),
            options: { hideMessages: 'fdsafd' },
            on: {
              done: function(results) {

                __.assertThat(results.errors, __.hasSize(1));
                done();
              }
            }
          });
      });
    });

    lab.test('will not error out with valid option "silent"', function(done) {
      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/not-error-out-valid-template-and-output-directory-with-valid-silent-option'))
      .then(function() {

        dirgen({
          template: (fixtureDir + '/one-slash.txt'),
          output: (__dirname + '/case-outputs/not-error-out-valid-template-and-output-directory-with-valid-silent-option'),
          options: { hideMessages: true },
          on: {
            done: (results) => {
              __.assertThat(results.errors, __.isEmpty());
              done();
            }
          }
        });

      });
    });

    lab.test('will error out with only the options key, no "template" or "output" key', function(done) {
      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/error-out-with-only-option-key'))
      .then(function() {

        dirgen({
          options: { hideMessages: true },
          on: {
            done: (results) => {
              __.assertThat(results.errors, __.hasSize(1));
              done();
            }
          }
        });
      });
    });

    lab.test('will print out line information on "line" callback', function(done) {
      var proxyquire = require('proxyquire');
      var dirgen = proxyquire(dirgenCliEntry, {});

      fs.mkdirAsync((__dirname +
       '/case-outputs/contain-line-information-on-line-callback'))
      .then(function() {

        dirgen({
          template: (fixtureDir + '/top-level-repeated-line.txt'),
          output: (__dirname +
           '/case-outputs/contain-line-information-on-line-callback'),
          options: { hideMessages: false },
          on: {
            done: (results) => {
              __.assertThat(results.errors, __.isEmpty());
              done();
            },
            line: (stat) => {
              __.assertThat(stat, __.containsString('Line #'));
            }
          }
        });

      });
    });


  });
};
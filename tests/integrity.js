'use strict'

var lab = exports.lab = require('lab').script();
var __ = require('hamjest');

lab.test('returns true when 1 + 1 equals 2', (done) => {

    __.assertThat((1 + 1), __.equalTo(2));
    done();
});

// var path = require('path');
// var child = require('child_process');
//
// console.log("process.cwd(),", process.cwd());
// var bin = path.resolve(__dirname, '../bin/');
// console.log("bin", bin);
//
// console.log("__dirname", __dirname);
//
// var exec = child.exec;
//
// var entry = exec("node " + bin + "/dirgen-cli-entry.js g ", function (error, stdout, stderr) {
//   // if you also want to change current process working directory:
//   console.log("error", error);
//   console.log("stdout", stdout);
//   console.log("stderr", stderr);
// });
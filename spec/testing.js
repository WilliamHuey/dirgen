//
//
// describe("A suite", function() {
//   it("contains spec with an expectation", function() {
//     expect(true).toBe(false);
//   });
// });
var childProcess = require('child_process'),
  path = require('path');

var bin = path.resolve(__dirname, '../bin/'),
  cliEntry = bin + '/dirgen-cli-entry.js';

console.log("cliEntry", cliEntry);
var exec = childProcess.exec;
var cli = exec('node ' + cliEntry);

cli.stdout.on('data', (data) => {
  console.log('stdout:', data);
});

cli.stderr.on('data', (data) => {
  console.log('stderr:', data);
});

cli.once('close', (data) => {
  console.log('close: ', data);
});

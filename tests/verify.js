'use strict'

import test from 'ava';
import child from 'child_process';
import path from 'path';
// import spawn from 'spawn-please';

// console.log('proces env path', process.env.PATH );
console.log("process.cwd(),", process.cwd());
var bin = path.resolve(process.cwd(), '../bin/');
console.log("bin", bin);

const exec = child.exec;
const entry = exec(`node ../bin/dirgen-cli-entry.js dsfad asfds`, function (error, stdout, stderr) {
  // if you also want to change current process working directory:
  console.log("error", error);
  console.log("stdout", stdout);
  console.log("stderr", stderr);
});

entry.on('close', function(){
  console.log("close on entry");
});

const cmd = path.resolve(__dirname, '../bin/dirgen-cli-entry.js');
// console.log("cmd", cmd);
const nodeCmd = 'node ' + cmd;
// console.log("nodeCmd", nodeCmd);

// test('show the help command with no template or folder', t => {

    // t.notDeepEqual([1, 2], [1, 2]);
    // child.exec(nodeCmd, function(err, stdout) {
    //   console.log("err", err);
    //   console.log("exec dirgen stdout, ", stdout);
    //   // code.expect(stdout).to.contain('Generate files and folders from a template file.' + type);
    //   // done(err);
    //   t.notDeepEqual([1, 2], [1, 2]);
    // });
// });
import test from 'ava';
import child from 'child_process';
import path from 'path';

var exec = require('child_process').exec;




// console.log("__dirname", __dirname);
// console.log("path.resolve(${__dirname}", path.resolve(__dirname, '../dist'));

const cmd = path.resolve(__dirname, '../dist/dirgen.js');
// console.log("cmd", cmd);
const nodeCmd = 'node ' + cmd;

// console.log("nodeCmd", nodeCmd);
//
// const execFile = require('child_process').execFile;


test('show the help command with no template or folder', t => {

  const
    spawn = require( 'child_process' ).spawn,
    ls = spawn( 'node', [ './makeASound.js'] );

ls.stdout.on( 'data', ( data ) => {
    console.log( `stdout: ${data}` );
});

ls.stderr.on( 'data', ( data ) => {
    console.log( `stderr: ${data}` );
});

ls.on( 'close', ( code ) => {
    console.log( `child process exited with code ${code}` );
});


  // exec('node ./makeASound.js', function(error, stdout, stderr) {
  //   console.log("error", error);
  //   console.log("stdout", stdout);
  //   console.log("stderr", stderr);
  // });


  // const child = execFile('node', [cmd] ,(error, stdout, stderr) => {
  //   if (error) {
  //     throw error;
  //   }
  //   console.log(stdout);
  // });

  // var child = spawn(process.execPath, [__filename, 'child'])

//   const exec = require('child_process').exec;
// const child = exec('../dist/dirgen.js',
//   (error, stdout, stderr) => {
//
//     console.log(`stdout: ${stdout}`);
//     console.log(`stderr: ${stderr}`);
//     if (error !== null) {
//       console.log(`exec error: ${error}`);
//     }
//     throw(new Error('stop'));
// });

//   const spawn = require('child_process').spawn;
//   const ls = spawn(nodeCmd);
//
//   ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });
//   ls.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });


    // t.notDeepEqual([1, 2], [1, 2]);
    // child.exec(nodeCmd, function(err, stdout) {
    //   console.log("err", err);
    //   console.log("exec dirgen stdout, ", stdout);
    //   // code.expect(stdout).to.contain('Generate files and folders from a template file.' + type);
    //   // done(err);
    //   t.notDeepEqual([1, 2], [1, 2]);
    // });
});
'use strict';

console.time('Command Line Execution Time');

//Native modules
import fs from 'fs';

//Vendor modules
import nash from 'nash';
import path from 'path';
import isTextPath from 'is-text-path';

//Execution directory gives the proper path for the demo example
const cli = nash();
const cliArgs = process.argv;

import messenger from './validations-messages';

const message = (msg) => {

  //Add a new line for the error
  //Extra blank line is intentional
  messenger.error(`${msg}\n

  `);
};

const helpText = `
  \x1B[1m Description: \x1B[22m

    Generate files and folders from a template file.

  \x1B[1m Usage: \x1B[22m

    dirgen [command] [command parameters] [options]

  \x1B[1m Command: \x1B[22m           \x1B[1m Command Parameters: \x1B[22m
   (Alias below)        (in respective order)

    generate             <template> (required)
    (g | gen)             The text file provided for generation
                          Ex: "/some-directory/my-file-template.txt"

                         <output directory> (required)
                          The destination location where the generated files
                          or folder should go.

    demo                 N/A
                          Shows an example of how a template file is used
                          to generate files and folder inside the /demo folder
                          of the Dirgen NPM module.

    version              N/A
    (v)                   Display what is the edition of this module.
                        `;

//Get assistance on the command use of this module
cli
  .command('help')
  .name('h')
  .handler(function (data, flags, done) {
    console.log(helpText);
  });

//Option --help is an alias for command 'help'
if(cliArgs[2] === '--help' ||
cliArgs[2] === '-h' ||
cliArgs.length === 2) {
  cli.run(['', '', 'help'], function () {});
}

//Get the version from the package.json file
let packageJson = null;
cli
  .command('version')
  .name('v')
  .handler(function (data, flags, done) {
    console.log(`Dirgen v${packageJson.version}`);
  });

const commands = ['generate', 'g', 'gen',
                  'demo', 'version', 'v', '--version', '-v', 'help', 'h', '--help', '-h' ];

//Non-matching commands will trigger the help doc
if(commands.indexOf(cliArgs[2]) < 0 && cliArgs.length > 2) {
  console.log(`Dirgen: '${cliArgs[2]}' is not a recognized command. Type 'dirgen --help' for a list of commands.`);
}

//Need this line for the commands to work
cli.run(cliArgs, function () {});

module.exports = function(execPath) {

  //Show an example of how the module is used
  cli
    .command('demo')
    .handler(function (data, flags, done) {
      console.log("running demo execPath", execPath);
      require('./dirgen').default({action: 'demo', 'execPath': execPath});
    });

  //Create files or folders
  cli
    .command('generate')
    .name(['gen', 'g'])
    .handler(function (data, flags, done) {

      //Quit early when not enough arguments are provided
      const commandArgsLen = data.length;
      if (commandArgsLen === 0) {
        message('No file template nor folder destination given.');
        return;
      } else if (commandArgsLen === 1) {
        message('No folder destination given in second command input.');
        return;
      }

      Promise.all([

        //Check for file template
        new Promise(function(resolve, reject){
          fs.stat(data[0], function(error){
            if (error) {
              message('Not a valid file. Need a plain text file format in the first command input.');
              return reject({ file: false });
            } else {

              //Check for text file
              if (!isTextPath(data[0])) {
                message('Not a valid template file. Please provide a plain text file format in the first command input.');
                return resolve({ file: false });
              } else {
                return resolve({ file: true });
              }
            }
          });
        }),

        //Check for folder
        new Promise(function(resolve, reject){
          fs.stat(data[1], function(error){
            if (error) {
              message('Not a valid folder. Please provide a valid folder in the second command input.');
              return reject({ folder: false });
            } else {
              return resolve({ folder: true });
            }
          });
        })
      ]).then(function(values) {
        console.log("just before execPath", execPath);
        console.log("data", data);

        //Only generate on valid file and folder input
        if (values[0].file && values[1].folder) {
          require('./dirgen').default('generate',
          { template: data[0], output: data[1] });
        }
      }, function() {});
    });

  //Read the version from package.json
  //In the exports function because needs access to the read path
  fs.readFile(path.resolve(execPath, '../package.json'),
  "utf-8", function (err, data) {
    try {
      packageJson = JSON.parse(data);
      if(cliArgs[2] === '--version' ||
        cliArgs[2] === '-v') {
        cli.run(['', '', 'version'], function () {});
      }
    } catch (e) {
      message('Read error on JSON file:', e);
    }
  });
}
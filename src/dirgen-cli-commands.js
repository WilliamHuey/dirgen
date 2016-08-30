'use strict';

//Add support for features in ES2015 as maps and promises
import "babel-polyfill";

//Native modules
import fs from 'fs';

//Vendor modules
import nash from 'nash';
import path from 'path';
import isTextPath from 'is-text-path';
import {
  readJsonAsync
} from 'fs-extra-promise';
import co from 'co';
import includes from 'array-includes';

//Source modules
import helpText from './dirgen-cli-commands-text';
import messenger from './validations-messages';
import validCliCommands from './cli-command-valid.json';

//Array of cli commands for sync and async operations
const { commands, asyncCommands} =  validCliCommands;

//Execution directory gives the proper path for the demo example
const cli = nash();
const cliArgs = process.argv;

const message = (msg) => {

  //Add a new line for the error
  //Extra blank line is intentional
  messenger.error(`${msg}\n

  `);
};

//Command from console
const cliCommand = cliArgs[2];

//Non-matching commands will trigger the help doc
let isValidCommand = false;
if (!includes(commands, cliCommand) && cliArgs.length > 2 &&
  !includes(asyncCommands, cliCommand)) {
  console.log(`Dirgen: '${cliCommand}'
  is not a recognized command. Type 'dirgen --help' for a list of commands.`);
} else {
  isValidCommand = true;
}

module.exports = function(execPath, fromCli) {

  if (!fromCli) {
    require('./dirgen')
      .default({
        action: 'generate',
        //execPath will actually be the settings for
        //when the dirgen is required
        'settings': execPath
      });
    return;
  }

  //Show an example of how the module is used
  cli
    .command('demo')
    .handler(function(data, flags, done) {

      //Check for overwrite flag to write over existing files or folders
      const forceOverwrite = flags.f;

      require('./dirgen')
        .default({
          action: 'demo',
          'execPath': execPath,
          options: {
            forceOverwrite
          }
        }, fromCli);
    });

  //Create files or folders
  cli
    .command('generate')
    .name(['gen', 'g'])
    .handler(function(data, flags, done) {

      //Check for overwrite flag to write over existing files or folders
      const forceOverwrite = flags.f;

      //Prevent the errors and warnings from showing up in the console output
      const hideMessages = flags.s;

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
        new Promise(function(resolve, reject) {
            fs.stat(data[0], function(error) {
              if (error) {
                message('Not a valid file. Need a plain text file format in the first command input.');
                return reject({
                  file: false
                });
              } else {

                //Check for text file
                if (!isTextPath(data[0])) {
                  message('Not a valid template file. Please provide a plain text file format in the first command input.');
                  return resolve({
                    file: false
                  });
                } else {
                  return resolve({
                    file: true
                  });
                }
              }
            });
          }),

        //Check for folder
        new Promise(function(resolve, reject) {
          fs.stat(data[1], function(error) {
            if (error) {
              message('Not a valid folder. Please provide a valid folder in the second command input.');
              return reject({
                folder: false
              });
            } else {
              return resolve({
                folder: true
              });
            }
          });
        })
      ])
        .then(function(values) {

          //Only generate on valid file and folder input
          if (values[0].file && values[1].folder) {

            require('./dirgen')
              .default('generate', {
                template: data[0],
                output: data[1],
                options: {
                  forceOverwrite,
                  hideMessages
                }
              }, fromCli);
          }
        }, function() {});
    });

  //Get assistance on the command use of this module
  cli
    .command('help')
    .name('h')
    .handler(function(data, flags, done) {
      console.log(helpText);
    });

  //Option --help is an alias for command 'help'
  if (cliCommand === '--help' ||
    cliCommand === '-h' ||
    cliArgs.length === 2) {

    cli.run(['', '', 'help'], function() {});
  }

  if (includes(asyncCommands, cliCommand)) {

    const getJSON = co.wrap(function* (cli) {
      let packageJson = {};

      //Get the version from the package.json file
      cli
        .command('version')
        .name('v')
        .handler(function(data, flags, done) {
          console.log(`Dirgen v${packageJson.version}`);
        });

      //Read the version from package.json
      //In the exports function because needs access to the read path
       packageJson = yield readJsonAsync(
        path.resolve(execPath, '../package.json'));

      cli.run(['', '', 'version'], function() {});

    });

    co(function* () {
      try {
        yield getJSON(cli);
      } catch (error) {
        console.error('Error from reading package.json:', error);
      }
    });

  } else if (isValidCommand) {

    //Run the supplied command if it one of the existing commands
    cli.run(cliArgs, function() {});
  }
};

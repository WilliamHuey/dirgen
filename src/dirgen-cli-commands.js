//Add support for features in ES2015 as maps and promises

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
import ansimd from 'ansimd';

//Source modules
import helpText from './dirgen-cli-commands-text';
import messenger from './validations-messages';
import validCliCommands from './cli-command-valid.json';
import requireValidationMessages from './require-validations-messages';
import htmlHelpText from '../README.md';

if (typeof global._babelPolyfill !== 'undefined') {
  require('babel-polyfill');
}

//Array of cli commands for sync and async operations
const { commands, asyncCommands } = validCliCommands;

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

const cliCommands = (execPath, fromCli) => {

  //Non-matching commands will trigger the help doc
  let isValidCommand = false;
  if (!includes(commands, cliCommand) && cliArgs.length > 2 &&
    !includes(asyncCommands, cliCommand) &&
    fromCli) {
    console.log(`Dirgen: '${cliCommand}'
    is not a recognized command. Type 'dirgen --help' for a list of commands.`);
  } else {
    isValidCommand = true;
  }

  if (!fromCli) {
    const dirgen = require('./dirgen');

    dirgen({
        action: 'generate',

        //execPath will actually be the settings for
        //when the dirgen is required
        'settings': execPath
      },
      undefined,
      fromCli,
      );

    return dirgen;
  }

  //Show an example of how the module is used
  cli
    .command('demo')
    .handler((data, flags, done) => {

      //Check for overwrite flag to write over existing files or folders
      let forceOverwrite = false;
      if (typeof flags.f !== 'undefined') {
        if (flags.f) {
          forceOverwrite = true;
        } else {
          forceOverwrite = false;
        }
      } else {
        forceOverwrite = false;
      }

      require('./dirgen')({
          action: 'demo',
          'execPath': execPath,
          options: {
            forceOverwrite
          }
        },
        undefined,
        fromCli);
    });

  //Create files or folders
  cli
    .command('generate')
    .name(['gen', 'g'])
    .handler((data, flags, done) => {

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
        new Promise((resolve, reject) => {
            fs.stat(data[0], (error) => {
              if (error) {
                message(requireValidationMessages.inValidTemplateMsg);
                return reject({
                  file: false
                });
              } else if (!isTextPath(data[0])) {

                //Check for text file
                message(`Not a valid template file. Please
                  provide a plain text file format in
                  the first command input.`);
                return resolve({
                  file: false
                });
              } else {
                return resolve({
                  file: true
                });
              }
            });
          }),

        //Check for folder
        new Promise((resolve, reject) => {
          fs.stat(data[1], (error) => {
            if (error) {
              message(`Not a valid folder. Please provide a
                valid folder in the second command input.`);
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
        .then((values) => {

          //Only generate on valid file and folder input
          if (values[0].file && values[1].folder) {
            require('./dirgen')('generate', {
                template: data[0],
                output: data[1],
                options: {
                  'forceOverwrite': forceOverwrite,
                  'hideMessages': hideMessages
                }
              }, fromCli);
          }
        }, () => {});
    });

  //Get assistance on the command use of this module
  cli
    .command('help')
    .name('h')
    .handler((data, flags, done) => {
      console.log(ansimd(htmlHelpText));
    });

  //Option --help is an alias for command 'help'
  if (cliCommand === '--help' ||
    cliCommand === '-h' ||
    cliArgs.length === 2) {

    cli.run(['', '', 'help'], () => {});
  }

  if (includes(asyncCommands, cliCommand)) {

    const getJSON = co.wrap(function* coGetJsonWrap(cli) {
      let packageJson = {};

      //Get the version from the package.json file
      cli
        .command('version')
        .name('v')
        .handler((data, flags, done) => {
          console.log(`Dirgen v${packageJson.version}`);
        });

      //Read the version from package.json
      //In the exports function because needs access to the read path
       packageJson = yield readJsonAsync(
        path.resolve(execPath, '../package.json'));

      cli.run(['', '', 'version'], () => {});

    });

    co(function* coGetJson() {
      try {
        yield getJSON(cli);
      } catch (error) {
        console.error('Error from reading package.json:', error);
      }
    });

  } else if (isValidCommand) {

    //Run the supplied command if it one of the existing commands
    cli.run(cliArgs, () => {});
  }

  return this;
};

module.exports = cliCommands;
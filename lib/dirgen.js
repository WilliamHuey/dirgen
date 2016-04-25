'use strict';

console.time('Command Line Execution Time');

import fs from 'fs';

//Vendor modules
import _ from 'lodash';
import nash from 'nash';

const cli = nash();
const cliArgs = process.argv;
const helpText = `
  Description:

    Generate files and folders from a template file.

  Usage:

    dirgen [command] [command parameters] [options]

  Command:             Command Parameters:
  (Alias)

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
                        `;

cli
  .command('generate')
  .name('g', 'gen')
  .handler(function (data, flags, done) {

    require('../src/dirgen').default('generate',
     _.zipObject(['template', 'output'], data));
    done(console.timeEnd('Command Line Execution Time'));
  });

cli
  .command('demo')
  .handler(function (data, flags, done) {
    require('../src/dirgen').default('demo');
    done(console.timeEnd('Command Line Execution Time'));
  });

cli
  .command('help')
  .name('h')
  .handler(function (data, flags, done) {
    console.log(helpText);
    done(console.timeEnd('Command Line Execution Time'));
  });

//Option --help is an alias for command 'help'
if(cliArgs[2] === '--help') {
  cli.run(['', '', 'help'], function () {});
}

//Get the version from the package.json file
let packageJson = null;
fs.readFile('../package.json', "utf-8", function (err, data) {
  try {
    cli
      .command('version')
      .name('v')
      .handler(function (data, flags, done) {
        console.log(`Dirgen v${packageJson.version}`);
        done(console.timeEnd('Command Line Execution Time'));
      });

    packageJson = JSON.parse(data);

    if(cliArgs[2] === '--version') {
      cli.run(['', '', 'version'], function () {});
    }
  } catch (e) {
    console.error('Read error on JSON file:', e);
  }
});

//Need this line for the commands to work
cli.run(cliArgs, function () {});

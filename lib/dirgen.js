import yargs from 'yargs';
import _ from 'lodash';

const argv = yargs.argv;
const currentDirectory = process.cwd();

const createCommand = (commands, helpText, argFn, commandFn) => {
  let commandNamesGroup = commands.split(' || ');
  if (commandNamesGroup.length > 1) {
    let commandNames = JSON.parse(commandNamesGroup[0]);
    for (let i = 0; i < commandNames.length; i++) {
      yargs.command(`${commandNames[i]} ${commandNamesGroup[1]}`, helpText, argFn, commandFn)
        .help()
        .argv
    }
  } else {
    yargs.command(commands, helpText, argFn, commandFn)
      .help()
      .argv
  }

};

createCommand('["g", "gen", "generate"] || <template>',
  'Generate file and folders from template a file',
  () => {},
  function(yargs) {
    console.log("Create the supplied file and folders from a template");
  });

createCommand('demo', 'Generate a sample output',
  () => {},
  function() {
    require('../src/dirgen')('demo');
  });
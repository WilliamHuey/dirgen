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
        .argv
    }
  } else {
    yargs.command(commands, helpText, argFn, commandFn)
      .argv
  }

};

createCommand('["g", "gen", "generate"] || <template> <output>',
  `command alias: gen | generate

  <template>
  Generate files and/or folders from a supplied template. Ex: "~/Desktop/my-template.txt"

  <output>
  Output is the generation folder location.
  Ex: "~/Desktop/my-output-folder"`,
  () => {},
  function(yargs) {
    console.log("Create the supplied file and folders from a template");
  });

  createCommand('["d", "den", "denerate"] || <template> <output>',
    `adsds adsfds`,
    () => {},
    function(yargs) {
      console.log("Create the supplied file and folders from a template");
    });

createCommand('demo', `Generate a sample output in the "Dirgen" module's folder "demo/example-output".`,
  () => {},
  function(yargs) {
    require('../src/dirgen').default('demo');
  });

  yargs.help('some help');
import yargs from 'yargs';
import _ from 'lodash';

const argv = yargs.argv;
const currentDirectory = process.cwd();

console.log("currentDirectory", currentDirectory);

const createCommand = (commands, helpText, argFn, commandFn) => {
  let commandNamesGroup = commands.split(' || ');
  if (commandNamesGroup.length > 1) {
    let commandNames = JSON.parse(commandNamesGroup[0]);
    for (let i = 0; i < commandNames.length; i++) {
      yargs.command(`${commandNames[i]} ${commandNamesGroup[1]}`, helpText, argFn, commandFn)
        .help(helpText)
        .argv
    }
  } else {
    yargs.command(commands, helpText, argFn, commandFn)
      .help(helpText)
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
    console.log("yargs", yargs);
    console.log("Create the supplied file and folders from a template");
  });

  createCommand('["d", "den", "denerate"] || <template> <output>',
    `adsds adsfds`,
    () => {},
    function(yargs) {
      console.log("yargs", yargs);
      console.log("Create the supplied file and folders from a template");
    });

createCommand('demo <t>', `Generate a sample output in the "Dirgen" module's folder "demo/example-output".`,
  () => {},
  function(yargs) {
    console.log("demo args", args);
    require('../src/dirgen').default('demo');
  });
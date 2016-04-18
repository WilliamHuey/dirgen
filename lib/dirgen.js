import yargs from 'yargs';

export default function() {
  yargs.command('demo', 'Generate a sample output', function (yargs) {
      console.log("Need to do the demo soon");
    })
    .help()
    .argv
}


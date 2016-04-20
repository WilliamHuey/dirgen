import yargs from 'yargs';

const argv = yargs.argv;

export default function() {
  //console.log("argv", argv._);
  const currentDirectory = process.cwd();

  yargs
  .command(
    'get',
    'make a get HTTP request',
    function (yargs) {
      return yargs.option('u', {
        alias: 'url',
        describe: 'the URL to make an HTTP request to'
      })
    },
    function (argv) {
      console.log(argv)
    }
  )
  .help()
  .argv

  yargs.command('g <template>', 'Generate a from template file',

  function (yargs) {
    return yargs.option('*', {
      describe: 'the URL to make an HTTP request to'
    })
  },
  function (yargs) {
    console.log("yargs", yargs);
    console.log("Create the supplied file and folders from a template");

  })
  .alias('g', ['gen'])
  .help()
  .argv

  yargs.command('demo', 'Generate a sample output', function (yargs) {
      console.log("Need to do the demo soon");
    })
    .help()
    .argv
}


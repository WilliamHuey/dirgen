//Check JavaScript environment before executing
if (typeof process === 'undefined') {
  console.error(`Not in a Node environment, can not advance with file and folder generation.`);
  if (typeof window !== 'undefined') {
    console.error('Most likely in a browser');
  }
}

export default function(execPath, fromCli) {

  // console.log('first execPath', execPath);
  require('./dirgen-cli-commands')(execPath, fromCli);
}
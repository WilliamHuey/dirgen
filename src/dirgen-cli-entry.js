//Check JavaScript environment before executing
if (typeof process === 'undefined') {
  console.error(`Not in a Node environment, can not advance with file and folder generation.`);
  if (typeof window !== 'undefined') {
    console.error('Most likely running in a browser.');
  }
}

export default (execPath, fromCli) => {
  require('./dirgen-cli-commands')(execPath, fromCli);
};
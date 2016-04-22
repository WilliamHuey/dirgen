//Demo template location and output
const commandType = {
  demo: {
    template: `${process.cwd()}/demo/example.txt`,
    output: `${process.cwd()}/demo/example-output/`
  }
};

//Check if command is for demoing
export default (type, action) => {
  if (type === 'demo') {
    return commandType[type][action];
  }
};
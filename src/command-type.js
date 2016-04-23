import path from 'path';

const rootModulePath = path.resolve(__dirname, '../');

//Demo template location and output
const commandType = {
  demo: {
    template: `${rootModulePath}/demo/example.txt`,
    output: `${rootModulePath}/demo/example-output/`
  }
};

//Check if command is for demoing
export default (type, action) => {
  if (type === 'demo') {
    return commandType[type][action];
  }
};
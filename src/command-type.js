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
export default (type, action, generateParams) => {

  if (type === 'demo') {
    return commandType[type][action];
  } else {
    console.log("need to process generateParams", generateParams);
    return generateParams[action];
  }
};
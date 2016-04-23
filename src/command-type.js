//Vendor modules
import path from 'path';

//Execution directory gives the proper path for the demo examle
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
    //Generate file and folders with given template and outpur dir info
    return generateParams[action];
  }
};
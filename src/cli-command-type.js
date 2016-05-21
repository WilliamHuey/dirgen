'use strict';

//Vendor modules
import path from 'path';

//Check if command is for demoing
export default (type, action, generateParams, execPath) => {

  //Execution directory gives the proper path for the demo example
  let rootModulePath = '';

  //execPath is only for the demo generation
  if(execPath) {
    rootModulePath = path.resolve(execPath, '../');
  }

  //Demo template location and output
  const commandType = {
    demo: {
      template: `${rootModulePath}/demo/example.txt`,
      output: `${rootModulePath}/demo/example-output/`
    }
  };


  if (type === 'demo') {
    return commandType[type][action];
  } else {

    //Generate file and folders with given template and outpur dir info
    return generateParams[action];
  }
};
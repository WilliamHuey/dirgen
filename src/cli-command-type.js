'use strict';

//Vendor modules
import path from 'path';

console.log("cli command type");

//Check if command is for demoing
export default (type, action, generateParams, execPath) => {
  console.log(" ran the cli command type");

  //Execution directory gives the proper path for the demo example
  let rootModulePath = '';

  if(execPath) {
    rootModulePath = path.resolve(execPath, '../');
  }

  console.log("rootModulePath", rootModulePath);
  // throw new Error('stop');

  //Demo template location and output
  const commandType = {
    demo: {
      template: `${rootModulePath}/demo/example.txt`,
      output: `${rootModulePath}/demo/example-output/`
    }
  };


  if (type === 'demo') {
    console.log("commandType[type][action]", commandType[type][action]);
    return commandType[type][action];
  } else {
    //Generate file and folders with given template and outpur dir info
    console.log("generate files");
    return generateParams[action];
  }
};
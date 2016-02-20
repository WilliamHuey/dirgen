'use strict';

//Native Nodejs modules
import fs from 'fs';

//Vendor modules
import fileExists from 'file-exists';
import _ from 'lodash';

//Source modules
import folderExists from './folder-exists';

/*
write both files and folder

should probably default to housing the files
and folders generated to a default named folder
to make it less more convenient to remove
accidentally created files or folders

read from the commandline or rc file
rc file has the name dirgen.config.js

*/

const createStructure = (linesInfo, rootPath) => {

  // console.log("createStructure", createStructure);
  console.log("linesInfo is ", linesInfo);
  console.log("rootPath", rootPath);


  // if file
  //   createFile()
  // if folder
  //   createFolder(children, parentDir)

  //Also start off creating siblings structure types
};

export default (linesInfo, rootPath) => {
  // console.log(`generation lines info is`, linesInfo);

  //Check for any specified folder to house
  //the files and folders to be generated

  //Hard code this folder for now
  if (folderExists('testing')) {
    fs.rmdirSync('testing');
  }

  //Get the first line from the linesInfo
  createStructure(linesInfo.firstLine, rootPath);

};
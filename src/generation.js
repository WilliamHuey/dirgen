'use strict';

//Native Nodejs modules
import fs from 'fs';
import path from 'path';

//Vendor modules
import fileExists from 'file-exists';
import _ from 'lodash';
import normalizePath from 'normalize-path';

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
  // console.log("linesInfo is ", linesInfo);
  // console.log("rootPath", rootPath);

  //Join the path safely by converting all backward
  //slashes to forward slashes
  let structureName = linesInfo.structureName,
    structureRoughPath = path.join(rootPath, structureName),
    structureCreatePath = normalizePath(structureRoughPath);

  // console.log("structureCreatePath", structureCreatePath);

  if (linesInfo.inferType === 'file') {
    // console.log("normalize root with struct path", structureCreatePath);
    //Create self structure, file
    //callback is not really needed
    console.log("file", linesInfo.structureName);
  } else {
    //Folder will be the only other structure type
    //Create self structure, folder
    //callback produces the child structures
    console.log("folder", linesInfo.structureName);
  }

  if (!_.isUndefined(linesInfo.sibling) && linesInfo.sibling.length > 0) {

    // console.log("some siblings children", linesInfo.sibling[0].children);

  }

  //siblings need to be created too if present for files and folders
  //


  /*
  How to keep track reliably of the current path?
  Keeping track of the plain string value will do
  by slicing and appending structure name to the string
  However, must ensure there must be certainty that
  the string manipulation will not cause
  race conditions
  */


  // if file
  //   createFile()
  // if folder
  //   createFolder(children, rootPath, parentDir)

  //Also start off creating siblings structure types
};



export default (linesInfo, rootPath) => {
  // console.log(`generation lines info is`, linesInfo);

  //TODO: Not taking in the rootpath directly
  //for now the path for now with dummy folder
  let hardCodeRootFolder = './testing';

  //Check for any specified folder to house
  //the files and folders to be generated

  //Hard code this folder for now
  if (folderExists('testing')) {
    // console.log("folder exists and removing");
    fs.rmdirSync(hardCodeRootFolder);
    fs.mkdirSync(hardCodeRootFolder);
  } else {
    //Create when no root folder exists
    fs.mkdirSync(hardCodeRootFolder);
  }

  //Get the first line from the linesInfo
  createStructure(linesInfo.firstLine, hardCodeRootFolder);

  //Also create the structure for all the siblings too

};
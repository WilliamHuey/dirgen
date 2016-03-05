'use strict';

/*
log out the generated paths
*/

//Native Nodejs modules
import fs from 'fs';
import path from 'path';

//Vendor modules
import fileExists from 'file-exists';
import _ from 'lodash';
import normalizePath from 'normalize-path';
import trampa from 'trampa';
import rimraf from 'rimraf';
import filenamify from 'filenamify';
import { existsAsync, mkdirAsync } from 'fs-extra-promise';

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

const createStructure = async(linesInfo, rootPath, firstContentLineIndentAmount) => {

  console.log("createStructure");
  // console.log("linesInfo is ", linesInfo);
  console.log("rootPath", rootPath);
// console.log("linesInfo", linesInfo);
  //Join the path safely by converting all backward
  //slashes to forward slashes
  let structureName = linesInfo.structureName,
    structureRoughPath = path.join(rootPath, structureName),
    structureCreatePath = normalizePath(structureRoughPath);

  console.log("structureCreatePath", structureCreatePath);

  // console.log("linesInfo.inferType", linesInfo.inferType);
  if (linesInfo.inferType === 'file') {
    // console.log("normalize root with struct path", structureCreatePath);
    //Create self structure, file
    //callback is not really needed
    console.log("file is", linesInfo.structureName);
  } else {
    //Folder will be the only other structure type
    //Create self structure, folder
    //callback produces the child structures
    console.log("folder is ", linesInfo.structureName);

    let parentPath = path.join(rootPath, linesInfo.structureName);
    console.log("parentPath", parentPath);
    // fs.mkdirSync(parentPath);
    await mkdirAsync(parentPath);

    if (linesInfo.children.length > 0) {

      _.each(linesInfo.children, (line) => {
        // console.log("children is ", line.structureName);

        createStructure(line, parentPath, firstContentLineIndentAmount);
      });
    }
  }

  //Only the top-most level need the siblings generation
  if (!_.isUndefined(linesInfo.sibling) &&
    linesInfo.sibling.length > 0 &&
    firstContentLineIndentAmount === linesInfo.nameDetails.indentAmount) {
    _.each(linesInfo.sibling, (line) => {
      createStructure(line, rootPath, firstContentLineIndentAmount);
    });
  }

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

};

export
default (linesInfo, rootPath) => {
  // console.log(`generation lines info is`, linesInfo);

  //TODO: Not taking in the rootpath directly
  //for now the path for now with dummy folder
  let hardCodeRootFolder = './testing';

  //Check for any specified folder to house
  //the files and folders to be generated

  //Hard code this folder for now
  if (fileExists('testing')) {
    console.log("folder exists and removing");
    rimraf(hardCodeRootFolder, async () => {
      //Create a folder after deleting it
      await mkdirAsync(hardCodeRootFolder)
      .then(function() {
        createStructure(linesInfo.firstLine,
          hardCodeRootFolder,
          linesInfo.firstContentLineIndentAmount);
      });
    });
  } else {
    //Create when no root folder exists
    (async()=> {
      await mkdirAsync(hardCodeRootFolder)
      .then(function() {
        console.log("no folder existed");
        createStructure(linesInfo.firstLine,
          hardCodeRootFolder,
          linesInfo.firstContentLineIndentAmount);
      });
    })();
  }
};
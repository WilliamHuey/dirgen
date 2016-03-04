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

//Source modules
import folderExists from './folder-exists';

async function sayHello() {
  console.log(await Promise.resolve('hello world'));
}

// At the top level, we have to use the promise format
// rather than the async format
sayHello().catch(err => console.log(err));

/*
write both files and folder

should probably default to housing the files
and folders generated to a default named folder
to make it less more convenient to remove
accidentally created files or folders

read from the commandline or rc file
rc file has the name dirgen.config.js

*/

const makeDirectory = () => {
  console.log('make directory');
  console.log('hardCodeRootFolder', hardCodeRootFolder);
  fs.mkdir(hardCodeRootFolder, () => {
    console.log("creating folder after deleting");
    //Get the first line from the linesInfo
    createStructure(linesInfo.firstLine,
      hardCodeRootFolder,
      linesInfo.firstContentLineIndentAmount);
  });
};

async function generateFolder() {
  // console.log(linesInfo.firstLine);
  console.log('gen folder');
  await makeDirectory();
}

const createStructure = (linesInfo, rootPath, firstContentLineIndentAmount) => {

  // console.log("createStructure");
  // console.log("linesInfo is ", linesInfo);
  // console.log("rootPath", rootPath);

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
    fs.mkdirSync(parentPath);

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

// console.time('compute');
//
// function loop(n, acc) {
//   return n === 0 ? trampa.wrap(acc) : trampa.lazy(function() {
//     return loop(n - 1, acc + 1);
//   });
// }
//
// loop(123456, 0).run();
// console.timeEnd('compute');

export
default (linesInfo, rootPath) => {
  // console.log(`generation lines info is`, linesInfo);

  //TODO: Not taking in the rootpath directly
  //for now the path for now with dummy folder
  let hardCodeRootFolder = './testing';

  //Check for any specified folder to house
  //the files and folders to be generated

  //Hard code this folder for now
  if (folderExists('testing')) {
    console.log("folder exists and removing");
    rimraf(hardCodeRootFolder, () => {
      //Create a folder after deleting it
      generateFolder();
    });
  } else {
    //Create when no root folder exists
    fs.mkdir(hardCodeRootFolder, () => {
      console.log("created folder when none existed");
      //Get the first line from the linesInfo
      createStructure(linesInfo.firstLine,
        hardCodeRootFolder,
        linesInfo.firstContentLineIndentAmount);
    });
  }



  //Also create the structure for all the siblings too

};

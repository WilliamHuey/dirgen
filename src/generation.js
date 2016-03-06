'use strict';

//Native Nodejs modules
import fs from 'fs';
import path from 'path';

//Vendor modules
import _ from 'lodash';
import normalizePath from 'normalize-path';
import trampa from 'trampa';
import filenamify from 'filenamify';
import {existsAsync, mkdirAsync, writeFileAsync, ensureDirAsync, removeAsync} from 'fs-extra-promise';

/*
write both files and folder

should probably default to housing the files
and folders generated to a default named folder
to make it less more convenient to remove
accidentally created files or folders

read from the commandline or rc file
rc file has the name dirgen.config.js

*/

const createStructure = async function (linesInfo, rootPath, firstContentLineIndentAmount) {

  // console.log("createStructure");
  // console.log("linesInfo is ", linesInfo);
  // console.log("rootPath", rootPath);
  // console.log("linesInfo", linesInfo);
  //Join the path safely by converting all backward
  //slashes to forward slashes
  let structureName = linesInfo.structureName,
    structureRoughPath = path.join(rootPath, structureName),
    structureCreatePath = normalizePath(structureRoughPath);

  // console.log("structureCreatePath", structureCreatePath);

  // console.log("linesInfo.inferType", linesInfo.inferType);
  if (linesInfo.inferType === 'file') {

    // console.log("normalize root with struct path", structureCreatePath);
    //Create self structure, file
    //callback is not really needed
    // console.log("file is", linesInfo.structureName);
    writeFileAsync(structureCreatePath);
  } else {
    //Folder will be the only other structure type
    //Create self structure, folder
    //callback produces the child structures
    // console.log("folder is ", linesInfo.structureName);

    let parentPath = path.join(rootPath, linesInfo.structureName);
    // console.log("parentPath", parentPath);
    await mkdirAsync(parentPath);

    if (linesInfo.children.length > 0) {
      // console.log("child present");
      _.each(linesInfo.children, (line) => {
        // console.log("children is ", line.structureName);

        createStructure(line, parentPath, firstContentLineIndentAmount);
      });
    }
  }

  //Only the top-most level need the siblings generation
  if (!_.isUndefined(linesInfo.sibling) && linesInfo.sibling.length > 0 && firstContentLineIndentAmount === linesInfo.nameDetails.indentAmount) {
    _.each(linesInfo.sibling, (line) => {
      createStructure(line, rootPath, firstContentLineIndentAmount);
    });
  }
};

export
default(linesInfo, rootPath) => {

  (async function dirGen() {
    //Check for root folder
    const hasRootDirAsync = await existsAsync(rootPath);
    if (hasRootDirAsync) {
      //Root folder exists and is to be removed
      await removeAsync(rootPath);
      await mkdirAsync(rootPath);
      createStructure(linesInfo.firstLine, rootPath, linesInfo.firstContentLineIndentAmount);
    } else {
      //No root folder found
      await mkdirAsync(rootPath);
      createStructure(linesInfo.firstLine, rootPath, linesInfo.firstContentLineIndentAmount);
    }
  })();
};
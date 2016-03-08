'use strict';

//Native Nodejs modules
import fs from 'fs';
import path from 'path';

//Vendor modules
import _ from 'lodash';
import normalizePath from 'normalize-path';
import trampa from 'trampa';
import filenamify from 'filenamify';
import {
  existsAsync,
  mkdirAsync,
  writeFileAsync,
  removeAsync} from 'fs-extra-promise';

const createStructure = async function (linesInfo, rootPath, firstContentLineIndentAmount) {

  //Join the path safely by converting all backward
  //slashes to forward slashes
  let structureName = linesInfo.structureName,
    structureRoughPath = path.join(rootPath, structureName),
    structureCreatePath = normalizePath(structureRoughPath);

  if (linesInfo.inferType === 'file') {
    writeFileAsync(structureCreatePath);
  } else {
    //Folder will be the only other structure type
    let parentPath = path.join(rootPath, linesInfo.structureName);

    await mkdirAsync(parentPath);

    //Create children structures if folder has children
    if (linesInfo.children.length > 0) {
      _.each(linesInfo.children, (line) => {
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
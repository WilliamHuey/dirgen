'use strict';

//Native Nodejs modules
import fs from 'fs';
import path from 'path';

//Vendor modules
import _ from 'lodash';
import normalizePath from 'normalize-path';
import recursive from 'tail-call/core';
import {
  existsAsync,
  mkdirAsync,
  writeFileAsync,
  removeAsync} from 'fs-extra-promise';

import Validations from './validations';

const validator = new Validations();
const tailCall = recursive.recur;

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = async function (lineInfo, rootPath, firstContentLineIndentAmount) {
  //lineInfo is a single line

  //Join the path safely by converting all backward
  //slashes to forward slashes
  let structureName = lineInfo.structureName,
    structureRoughPath = path.join(rootPath, structureName),
    structureCreatePath = normalizePath(structureRoughPath);

  if (lineInfo.inferType === 'file') {
    writeFileAsync(structureCreatePath);
  } else {
    //Folder will be the only other structure type
    let parentPath = path.join(rootPath, lineInfo.structureName);

    await mkdirAsync(parentPath);

    //Create children structures if folder has children
    if (lineInfo.children.length > 0) {

      validator.repeatedLines(
        lineInfo.nameDetails.line,
        lineInfo.children);

      _.each(lineInfo.children, (line) => {
        createStructureTC(line, parentPath, firstContentLineIndentAmount);
      });
    }
  }

  //Only the top-most level need the siblings generation
  if (!_.isUndefined(lineInfo.sibling) && lineInfo.sibling.length > 0 && firstContentLineIndentAmount === lineInfo.nameDetails.indentAmount) {
    _.each(lineInfo.sibling, (line) => {
      //TODO: validate for when the siblings dupes
      createStructureTC(line, rootPath, firstContentLineIndentAmount);
    });
  }
};

createStructureTC = tailCall(createStructure);

export
default(linesInfo, rootPath) => {

  (async function dirGen() {
    //Check for root folder
    const hasRootDirAsync = await existsAsync(rootPath);
    if (hasRootDirAsync) {
      //Root folder exists and is to be removed
      await removeAsync(rootPath);
      await mkdirAsync(rootPath);
    } else {
      await mkdirAsync(rootPath);
    }

    validator.topLevelRepeatedLines(
      linesInfo.firstLine,
      linesInfo.prevLineInfo.nameDetails.line);

    createStructureTC(linesInfo.firstLine, rootPath, linesInfo.firstContentLineIndentAmount);
    console.log("!!!!!!!!!!!! created");
  })();
};
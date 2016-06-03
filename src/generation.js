'use strict';

//Native modules
import fs from 'fs';
import path from 'path';

//Vendor modules
import normalizePath from 'normalize-path';
import recursive from 'tail-call/core';
import {
  existsAsync,
  mkdirAsync,
  writeFileAsync,
  removeAsync
} from 'fs-extra-promise';

//Source modules
import Validations from './lines-validations';

const validator = new Validations();
const tailCall = recursive.recur;

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = (lineInfo, rootPath,
  contentLineCount, resolve) => {

  let { structureName, inferType, nameDetails } = lineInfo;

  let name = nameDetails.sanitizedName ||
    structureName,
    structureRoughPath = path.join(rootPath, name),
    structureCreatePath = normalizePath(structureRoughPath);
  // console.log("nameDetails", nameDetails);
  console.log("structureCreatePath", structureCreatePath);

};

createStructureTC = tailCall(createStructure);

export default (linesInfo, rootPath) => {

  // console.log("linesInfo", linesInfo);

  //The total number of lines that are possible to generate
  let contentLineCount = linesInfo.contentLineCount;

  return new Promise((resolve, reject) => {

    //TODO: contentLineCount is not that reliable as
    //some lines will be skipped
    //Need readlines = genned lines + skipped lines

    //Take the outer-most level of elements which
    //serves as the initial generation set
    for (let i = 0; i < contentLineCount; i++) {
      if (typeof linesInfo.topLevel[i].repeatedLine === 'undefined') {
        let topLevelLine = linesInfo.topLevel[i];
        createStructureTC(topLevelLine, rootPath,
          contentLineCount, resolve);
      }
    }
  });

};

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

let structuresGenerated = 0;

let finishedGenerating = null;

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = async(lineInfo, rootPath,
  contentLineCount) => {

    // resolve();

  let {
    structureName,
    inferType,
    nameDetails
  } = lineInfo;

  let name = nameDetails.sanitizedName ||
    structureName,
    structureRoughPath = path.join(rootPath, name),
    structureCreatePath = normalizePath(structureRoughPath);
  // console.log("nameDetails", nameDetails);
  // console.log("structureCreatePath", structureCreatePath);
  console.log("inferType", inferType, structureCreatePath);

  if (lineInfo.inferType === 'file') {
    console.log("-------------------------");
    console.log("is a file structureCreatePath", structureCreatePath);
    console.log("========================");
    await writeFileAsync(structureCreatePath);
    structuresGenerated++;
  } else {
    let parentPath = path.join(rootPath, (nameDetails.sanitizedName || structureName));

    console.log("folder parentPath", parentPath);
    await mkdirAsync(parentPath);

    structuresGenerated++;

    if (lineInfo.children.length > 0) {
      lineInfo.children.forEach((line) => {
        createStructureTC(line, parentPath,
          contentLineCount);
          structuresGenerated++;
      });
    }

  }

  console.log("structuresGenerated", structuresGenerated);

  if (structuresGenerated === 11) {
    console.log("resolved");
    finishedGenerating();
    // return resolve();
  }

};

createStructureTC = tailCall(createStructure);

export default (linesInfo, rootPath) => {

  // console.log("linesInfo", linesInfo);

  //The total number of lines that are possible to generate
  let contentLineCount = linesInfo.contentLineCount;

  finishedGenerating = new Promise((resolve, reject) => {

    //Take the outer-most level of elements which
    //serves as the initial generation set
    for (let i = 0; i < contentLineCount; i++) {
      if (typeof linesInfo.topLevel[i].repeatedLine === 'undefined') {
        let topLevelLine = linesInfo.topLevel[i];
        createStructureTC(topLevelLine, rootPath,
          contentLineCount);
      }
    }
  });

  return finishedGenerating;

};

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

let structureCreation = {
  generated: 0,
  notGenerated: 0
};

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = (lineInfo, rootPath,
  contentLineCount, resolve) => {

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
  console.log("\n\n+++++++++++++++++++++++++++++++++ inferType", inferType, structureCreatePath);

  if (lineInfo.inferType === 'file') {

    console.log("is a file structureCreatePath", structureCreatePath);

    (async function () {
      await writeFileAsync(structureCreatePath);
    })();
    structureCreation.generated = structureCreation.generated + 1;
    console.log("structureCreation", structureCreation);
    console.log("<><><><>>><><><><>");
    // console.log(">>>><<<<><>< resolve", resolve);
    // resolve();
    // structuresGenerated++;
    //
    // console.log("structuresGenerated after file", structuresGenerated);
    console.log("========================");
    // resolve()
  } else {
    // resolve();
    let parentPath = path.join(rootPath, (nameDetails.sanitizedName || structureName));

    console.log("\n\n--------------------folder parentPath", parentPath);

    (async function () {
      await mkdirAsync(parentPath);
    })();

    structureCreation.generated = structureCreation.generated + 1;

    if (lineInfo.children.length > 0) {
      lineInfo.children.forEach((line) => {
        createStructureTC(line, parentPath,
          contentLineCount, resolve);
          structureCreation.generated = structureCreation.generated++;
      });
    }

  }

  if (structureCreation.generated === 11) {
    console.log("resolved");
    resolve();
    // return resolve();
  }

};

createStructureTC = tailCall(createStructure);

export default (linesInfo, rootPath) => {

  // console.log("linesInfo", linesInfo);

  //The total number of lines that are possible to generate
  let contentLineCount = linesInfo.contentLineCount;

  let structureGenerating = new Promise((resolve, reject) => {

    //Take the outer-most level of elements which
    //serves as the initial generation set
    for (let i = 0; i < contentLineCount; i++) {
      if (typeof linesInfo.topLevel[i].repeatedLine === 'undefined') {
        let topLevelLine = linesInfo.topLevel[i];
        createStructureTC(topLevelLine, rootPath,
          contentLineCount, resolve);
      } else {
        structureCreation.notGenerated = structureCreation.notGenerated + 1;
      }

    }
    console.log("////////////////////////////final structureCreation", structureCreation);
  });

  return structureGenerating;

};

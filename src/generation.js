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

const logNonGenerated = tailCall((lineInfo) => {

  if (lineInfo.children.length > 0) {
    lineInfo.children.forEach((line) => {
      if (line.inferType === 'file') {
        structureCreation.notGenerated = structureCreation.notGenerated + 1;
      } else {
        logNonGenerated(line);
      }
    });
  }

  structureCreation.notGenerated = structureCreation.notGenerated + 1;
});

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = (lineInfo, rootPath,
  contentLineCount, resolve) => {

  let {
    structureName,
    inferType,
    nameDetails
  } = lineInfo;

  let name = nameDetails.sanitizedName ||
    structureName,
    structureRoughPath = path.join(rootPath, name),
    structureCreatePath = normalizePath(structureRoughPath);

  if (lineInfo.inferType === 'file') {

    console.log("\n\n+++++++++++++++++++++++++++++++++ inferType", inferType, structureCreatePath);

    //Create the file type
    (async function () {
      await writeFileAsync(structureCreatePath);
    })();

    structureCreation.generated = structureCreation.generated + 1;
    console.log("file structureCreation", structureCreation);
    console.log("<><><><>>><><><><>");

  } else {
    let parentPath = path.join(rootPath, (nameDetails.sanitizedName || structureName));

    console.log("\n\n--------------------folder parentPath", parentPath);

    (async function () {
      await mkdirAsync(parentPath);
    })();

    structureCreation.generated = structureCreation.generated + 1;

    if (lineInfo.children.length > 0) {
      lineInfo.children.forEach((line) => {

        if (typeof line.childRepeatedLine === 'undefined') {
          createStructureTC(line, parentPath,
            contentLineCount, resolve);
        } else {
          structureCreation.notGenerated = structureCreation.notGenerated + 1;
          logNonGenerated(line);
        }

        console.log("folder structureCreation", structureCreation);

      });
    }
  }

  if (structureCreation.generated === 11) {
    console.log("resolved");
    resolve();
  }

};

createStructureTC = tailCall(createStructure);

export default (linesInfo, rootPath) => {

  //The total number of lines that are possible to generate
  let contentLineCount = linesInfo.contentLineCount;

  let structureGenerating = new Promise((resolve, reject) => {

    //Take the outer-most level of elements which
    //serves as the initial generation set
    console.log("``````````````contentLineCount", contentLineCount);
    for (let i = 0; i < contentLineCount; i++) {
      if (typeof linesInfo.topLevel[i].repeatedLine === 'undefined') {
        let topLevelLine = linesInfo.topLevel[i];
        createStructureTC(topLevelLine, rootPath,
          contentLineCount, resolve);
      } else {
        logNonGenerated(line);
        console.log("last non-gen structureCreation", structureCreation);
      }

    }
  });

  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

  return structureGenerating;
};

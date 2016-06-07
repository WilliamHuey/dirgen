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

//Log the lines that are not generated due to repeats
let structureCreation = {
  generated: 0,
  notGenerated: 0
};

const logNonGenerated = tailCall((structureCreation) => {
  structureCreation.notGenerated = structureCreation.notGenerated + 1;
});

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = (lineInfo, rootPath,
  contentLineCount, resolve) => {

  let {
    structureName,
    inferType,
    nameDetails,
    isTopLine,
    childRepeatedLine
  } = lineInfo;

  let name = nameDetails.sanitizedName ||
    structureName,
    structureRoughPath = path.join(rootPath, name),
    structureCreatePath = normalizePath(structureRoughPath);

  if (inferType === 'file') {

    if (!childRepeatedLine) {
      structureCreation.generated = structureCreation.generated + 1;

      //Create the file type
      (async function () {
        await writeFileAsync(structureCreatePath);
      })();

    } else {
      logNonGenerated(structureCreation);
    }
  } else {
    let parentPath = path.join(rootPath, (nameDetails.sanitizedName || structureName));

    let genFolder = false;

    //Only generate folder if it is not a repeat
    //Top level lines record repeats with only 'repeatedLine' while
    //child level lines repeats possess the 'repeatedLine' key
    if ((typeof childRepeatedLine ===
      'undefined' && lineInfo.repeatedLine !== true) ||
       (typeof lineInfo.repeatedLine === 'undefined' &&
        childRepeatedLine !== true)) {
      genFolder = true;

      //Create the folder
      (async function () {
        await mkdirAsync(parentPath);
      })();
      structureCreation.generated = structureCreation.generated + 1;
    } else {

      //folder will be logged as one that is not generated
      logNonGenerated(structureCreation);
    }

    //Ungenerated folder means a repeated line, but still attempt
    //to record the nested child of the repeated line
    if (!genFolder) {
      lineInfo.children.forEach((line) => {
        logNonGenerated(line, structureCreation);
      });
    } else if (lineInfo.children.length > 0) {
      lineInfo.children.forEach((line) => {

        //Again check for repeated lines in the child level lines
        //for the parent folder that is not repeated
        if (typeof lineInfo.childRepeatedLine === 'undefined') {
          createStructureTC(line, parentPath,
            contentLineCount, resolve);
        } else {
          logNonGenerated(line, structureCreation);
        }
      });
    }
  }

  //When all generated structures are created with the non-generated
  //structures ignored, signifies that the generation process comes to
  //an end
  if (structureCreation.generated + structureCreation.notGenerated
=== contentLineCount) {
    resolve();
  }
};

//Tail call wrapper
createStructureTC = tailCall(createStructure);

export default (linesInfo, rootPath) => {

  //The total number of lines that are possible to generate
  let contentLineCount = linesInfo.contentLineCount;
  let structureGenerating = new Promise((resolve, reject) => {

    //Take the outer-most level of elements which
    //serves as the initial generation set
    for (let i = 0; i < contentLineCount; i++) {
        let topLevelLine = linesInfo.topLevel[i];
        createStructureTC(topLevelLine, rootPath,
          contentLineCount, resolve);
    }
  });

  return structureGenerating;
};

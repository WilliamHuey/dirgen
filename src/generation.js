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

const logNonGenerated = tailCall((lineInfo, structureCreation) => {

  structureCreation.notGenerated = structureCreation.notGenerated + 1;
  console.log("structureCreation", structureCreation);
  console.log(">>>>>>>>>>>in logNonGenerated");
  //
  // if (lineInfo.children.length > 0) {
  //   lineInfo.children.forEach((line) => {
  //     if (line.inferType === 'file') {
  //       structureCreation.notGenerated = structureCreation.notGenerated + 1;
  //     } else {
  //       logNonGenerated(line);
  //     }
  //   });
  // } else {
  //   structureCreation.notGenerated = structureCreation.notGenerated + 1;
  // }
});

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = (lineInfo, rootPath,
  contentLineCount, resolve) => {
  console.log("\n\n----");
  console.log("lineInfo.structureName", lineInfo.structureName);
  console.log("lineInfo.isTopLine", lineInfo.isTopLine);

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

    console.log("inferType", inferType);
    console.log("childRepeatedLine", childRepeatedLine);

    if (!childRepeatedLine) {
      structureCreation.generated = structureCreation.generated + 1;
      console.log("file structureCreation", structureCreation);
      //Create the file type
      (async function () {
        await writeFileAsync(structureCreatePath);
      })();

    } else {
      logNonGenerated(lineInfo, structureCreation);
    }

  } else {

    //TODO: check for childRepeatedLine before actual folder generation
    console.log("//////////folder childRepeatedLine", childRepeatedLine);
    let parentPath = path.join(rootPath, (nameDetails.sanitizedName || structureName));

    console.log("folder parentPath", parentPath);

    let genFolder = false;

    //Only generate folder if it is not a repeat
    if ((typeof childRepeatedLine ===
      'undefined' && lineInfo.repeatedLine !== true) ||
       (typeof lineInfo.repeatedLine === 'undefined' && childRepeatedLine !== true)) {
      genFolder = true;
      (async function () {
        await mkdirAsync(parentPath);
      })();

      structureCreation.generated = structureCreation.generated + 1;
      // console.log("lineInfo", lineInfo);
      console.log("created folder");
    } else {
      logNonGenerated(lineInfo, structureCreation);
    }



    console.log("structureCreation after wait folder gen", structureCreation);
    console.log("--------------------------\n\n");

    if (!genFolder) {

      lineInfo.children.forEach((line) => {
        logNonGenerated(line, structureCreation);
      });

    } else if (lineInfo.children.length > 0) {
      lineInfo.children.forEach((line) => {

        console.log("line name", line.structureName);
        console.log("right after structureCreation.notGenerated", structureCreation.notGenerated);
        // console.log("line", line);
        console.log("line.isTopLine", line.isTopLine);
        console.log("lineInfo.nameDetails.line", lineInfo.nameDetails.line);

        //&&  !isTopLine
        if (typeof lineInfo.childRepeatedLine === 'undefined') {
          createStructureTC(line, parentPath,
            contentLineCount, resolve);
        } else {
          // structureCreation.notGenerated = structureCreation.notGenerated + 1;
          console.log("+++++++++++++++++++++++folder structureCreation", structureCreation);
          logNonGenerated(line, structureCreation);
        }



      });
    }
  }

  if (structureCreation.generated + structureCreation.notGenerated
=== contentLineCount) {
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
      console.log("linesInfo.topLevel[i].structureName", linesInfo.topLevel[i].structureName);
      // if (typeof linesInfo.topLevel[i].repeatedLine === 'undefined') {
        let topLevelLine = linesInfo.topLevel[i];
        createStructureTC(topLevelLine, rootPath,
          contentLineCount, resolve);
      // }

      // else {
      //
      //   console.log("last non-gen structureCreation", structureCreation);
      //   logNonGenerated(line, structureCreation);
      // }

    }
  });

  return structureGenerating;
};

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
import logValidations from './log-validations';

const validator = new Validations();
const tailCall = recursive.recur;

//Log the lines that are not generated due to repeats
let structureCreation = {
  generated: 0,
  notGenerated: 0,
  repeats: []
};

const logNonGenerated = tailCall((structureCreation, line) => {


  structureCreation.notGenerated = structureCreation.notGenerated + 1;

  structureCreation.repeats.push({name: line.structureName, line: line.nameDetails.line});

  //Repeated lines with further nesting also gets recorded

  console.log("++++++++++++++++++++++++++++children non-generated line is ", line.structureName);
  if (line.children.length > 0) {
    let nonGeneratedChildren = line.children;
    nonGeneratedChildren.forEach((line) => {
      logNonGenerated(structureCreation, line);
    });
  } else if (line.inferType === 'file'){
    console.log("file type repeat line name", line.structureName, ' and line ', line.nameDetails.line);
    // console.log("structureCreation", structureCreation);
    // structureCreation.notGenerated = structureCreation.notGenerated + 1;
  }

  console.log("structureCreation", structureCreation, "\n");


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
    childRepeatedLine,
    repeatedLine
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
      console.log(">> ");
      console.log("lineInfo.structureName", lineInfo.structureName);
      logNonGenerated(structureCreation, lineInfo);
      console.log("<><><><>>><><><>structureCreation", structureCreation, '\n\n');
    }
  } else {
    let parentPath = path.join(rootPath, (nameDetails.sanitizedName || structureName));

    let genFolder = false;

    // console.log("lineInfo", lineInfo);

    //Only generate folder if it is not a repeat
    //Top level lines record repeats with only 'repeatedLine' while
    //child level lines repeats possess the 'repeatedLine' key
    if (!childRepeatedLine && !repeatedLine) {
      genFolder = true;

      //Create the folder
      (async function () {
        await mkdirAsync(parentPath);
      })();
      structureCreation.generated = structureCreation.generated + 1;
    }

    let nonGenFolder = !genFolder && (repeatedLine || childRepeatedLine);

    // console.log("!genFolder", !genFolder);
    // console.log("repeatedLine", repeatedLine);
    // console.log("childRepeatedLine", childRepeatedLine);

    //Ungenerated folder means a repeated line, but still attempt
    //to record the nested child of the repeated line

    if (nonGenFolder) {
      console.log("||||||||||||||||lineInfo", lineInfo.structureName);

      // console.log("lineInfo.repeatedLine", lineInfo.repeatedLine);
      // console.log("lineInfo name", lineInfo.structureName);
      // lineInfo.children.forEach((line) => {
      //   console.log("~~~~~line.structureName", line.structureName);
      //   logNonGenerated(structureCreation, line);
      // });
      logNonGenerated(structureCreation, lineInfo);

    } else {

      if (lineInfo.children.length > 0) {
        //Checks for non-repeated folder
        lineInfo.children.forEach((line) => {

          //Again check for repeated lines in the child level lines
          // console.log("------");
          // console.log("line.structureName", line.structureName);
          if (typeof lineInfo.childRepeatedLine === 'undefined') {
            createStructureTC(line, parentPath,
              contentLineCount, resolve);
          }
          // console.log("=======");
        });
      }




    }
  }

  //When all generated structures are created with the non-generated
  //structures ignored, signifies that the generation process comes to
  //an end
  if (structureCreation.generated + structureCreation.notGenerated
=== contentLineCount) {
    console.log("structureCreation", structureCreation);
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

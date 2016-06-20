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
import message from './validations-messages';
import logValidations from './log-validations';
import Timer from './process-timer';

const validator = new Validations();
const tailCall = recursive.recur;

//Start timing the write process
let time = process.hrtime();

//Log the lines that are not generated due to repeats
let structureCreation = {
  generated: 0,
  notGenerated: 0,
  repeats: []
};

const logNonGenerated = tailCall((structureCreation, line, validationResults) => {
  structureCreation.notGenerated = structureCreation.notGenerated + 1;

  const isTopLine = line.isTopLine;

  //Log what is the originating first folder that was
  //not generated
  if (isTopLine) {
    line.firstNonGen = true;
    logValidations(validator.repeatedLines(structureCreation, line), validationResults);
  } else if ((line.childOfNonGen !== true &&
  line.parent.firstNonGen !== true)) {
    logValidations(validator.repeatedLines(structureCreation, line), validationResults);
  }

  //Repeated lines with further nesting also gets recorded
  if (line.children.length > 0) {
    let nonGeneratedChildren = line.children;
    nonGeneratedChildren.forEach((line) => {
      line.childOfNonGen = true;
      logNonGenerated(structureCreation, line, validationResults);
    });
  }
});

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = (lineInfo, rootPath,
  contentLineCount, validationResults, resolve) => {

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
    if (!childRepeatedLine && !repeatedLine) {
      structureCreation.generated = structureCreation.generated + 1;

      //Create the file type
      (async function () {
        try {
          await writeFileAsync(structureCreatePath, '');
        } catch (err) {
          message.error(`Generation error has occurred with file on Line #${lineInfo.nameDetails.line}: ${structureName}.`);
        }
      })();
    } else {
      logNonGenerated(structureCreation, lineInfo, validationResults);
    }
  } else {
    let parentPath = path.join(rootPath, (nameDetails.sanitizedName || structureName));

    let genFolder = false;

    //Only generate folder if it is not a repeat
    //Top level lines record repeats with only 'repeatedLine' while
    //child level lines repeats possess the 'repeatedLine' key
    if (!childRepeatedLine && !repeatedLine) {
      genFolder = true;

      //Create the folder
      (async function () {
        try {
          await mkdirAsync(parentPath);
        } catch (err) {
          message.error(`Generation error has occurred with folder on Line #${lineInfo.nameDetails.line}: ${structureName}.`);
        }
      })();
      structureCreation.generated = structureCreation.generated + 1;
    }

    let nonGenFolder = !genFolder && (repeatedLine || childRepeatedLine);

    //Ungenerated folder means a repeated line, but still attempt
    //to record the nested child of the repeated line
    if (nonGenFolder) {
      logNonGenerated(structureCreation, lineInfo, validationResults);
    } else {
      if (lineInfo.children.length > 0) {

        //Checks for non-repeated folder
        lineInfo.children.forEach((line) => {

          //Again check for repeated lines in the child level lines
          if (typeof lineInfo.childRepeatedLine === 'undefined') {
            createStructureTC(line, parentPath,
              contentLineCount, validationResults, resolve);
          }
        });
      }
    }
  }

  //When all generated structures are created with the non-generated
  //structures ignored, signifies that the generation process comes to
  //an end
  if (structureCreation.generated + structureCreation.notGenerated ===
    contentLineCount) {
    (new Timer())
    .onExit(time);
    resolve();
  }
};

//Tail call wrapper
createStructureTC = tailCall(createStructure);

export default (linesInfo, rootPath, validationResults) => {

  //The total number of lines that are possible to generate
  let contentLineCount = linesInfo.contentLineCount;
  let structureGenerating = new Promise((resolve, reject) => {

    //Take the outer-most level of elements which
    //serves as the initial generation set
    for (let i = 0; i < contentLineCount; i++) {
      let topLevelLine = linesInfo.topLevel[i];
      createStructureTC(topLevelLine, rootPath,
        contentLineCount, validationResults, resolve);
    }
  });

  return structureGenerating;
};

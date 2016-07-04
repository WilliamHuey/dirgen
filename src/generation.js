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

const logNonGenerated = tailCall((linesInfo, structureCreation, line, validationResults) => {
  structureCreation.notGenerated = structureCreation.notGenerated + 1;

  const isTopLine = line.isTopLine;

  //Log what is the originating first folder that was
  //not generated
  if (isTopLine) {
    line.firstNonGen = true;
    logValidations(validator.repeatedLines(linesInfo, structureCreation, line), validationResults);
  } else if ((line.childOfNonGen !== true &&
  line.parent.firstNonGen !== true)) {
    logValidations(validator.repeatedLines(linesInfo, structureCreation, line), validationResults);
  }

  //Repeated lines with further nesting also gets recorded
  if (line.children.length > 0) {
    let nonGeneratedChildren = line.children;
    nonGeneratedChildren.forEach((line) => {
      line.childOfNonGen = true;
      logNonGenerated(linesInfo, structureCreation, line, validationResults);
    });
  }
});

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = (linesInfo, lineInfo, rootPath,
  contentLineCount, validationResults, options, resolve) => {

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
      structureCreation.generated += 1;

      //Track the first of the line's repeats
      if (isTopLine) {
        linesInfo.topLevelIndex[structureName] = lineInfo.nameDetails.line;
      }

      //Create the file type
      (async function () {
        try {
          await writeFileAsync(structureCreatePath, '');
        } catch (err) {
          message.error(`Generation error has occurred with file on Line #${lineInfo.nameDetails.line}: ${structureName}.`);
          structureCreation.generated -= 1;
        }
      })();
    } else {
      logNonGenerated(linesInfo, structureCreation, lineInfo, validationResults);
    }
  } else {
    let parentPath = path.join(rootPath, (nameDetails.sanitizedName || structureName));

    let genFolder = false;

    //Track the first of the line's repeats
    if (!repeatedLine && isTopLine) {
      linesInfo.topLevelIndex[structureName] = lineInfo.nameDetails.line;
    }

    //Only generate folder if it is not a repeat
    //Top level lines record repeats with only 'repeatedLine' while
    //child level lines repeats possess the 'repeatedLine' key
    if (!childRepeatedLine && !repeatedLine) {
      genFolder = true;

      //Create the folder
      (async function () {
        try {

          await mkdirAsync(parentPath, (res, err) => {
            if (res !== null) {

              //Error in writing folder
              //Check if force overwrite option is enabled for overwriting
            }
          });

        } catch (err) {
          message.error(`Generation error has occurred with folder on Line #${lineInfo.nameDetails.line}: ${structureName}.`);
        }
      })();
      structureCreation.generated += 1;
    }

    let nonGenFolder = !genFolder && (repeatedLine || childRepeatedLine);

    //Ungenerated folder means a repeated line, but still attempt
    //to record the nested child of the repeated line
    if (nonGenFolder) {
      logNonGenerated(linesInfo, structureCreation, lineInfo, validationResults);
    } else {
      if (lineInfo.children.length > 0) {

        //Checks for non-repeated folder
        lineInfo.children.forEach((line) => {

          //Again check for repeated lines in the child level lines
          if (typeof lineInfo.childRepeatedLine === 'undefined') {
            createStructureTC(linesInfo, line, parentPath,
              contentLineCount, validationResults, options, resolve);
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
    resolve(structureCreation);
  }
};

//Tail call wrapper
createStructureTC = tailCall(createStructure);

export default (linesInfo, rootPath, validationResults, actionParams) => {

  //Flag definition to allow for changing the defaults values such as allowing for overwriting existing files or folders
  const { options } = actionParams;

  //The total number of lines that are possible to generate
  let contentLineCount = linesInfo.contentLineCount;
  let structureGenerating = new Promise((resolve, reject) => {

    //Take the outer-most level of elements which
    //serves as the initial generation set
    for (let i = 0; i < contentLineCount; i++) {
      let topLevelLine = linesInfo.topLevel[i];
      createStructureTC(linesInfo, topLevelLine, rootPath,
        contentLineCount, validationResults, options, resolve);
    }
  });

  return structureGenerating;
};

//Native modules
import path from 'path';

//Vendor modules
import normalizePath from 'normalize-path';
import recursive from 'tail-call/core';
import {
  ensureDirAsync,
  writeFileAsync,
  removeAsync,
  statAsync
} from 'fs-extra-promise';
import co from 'co';

//Source modules
import Validations from './lines-validations';
import message from './validations-messages';
import logValidations from './log-validations';
import requireMessages from './require-messages';

const validator = Validations;
const tailCall = recursive.recur;

//Log the lines that are not generated due to repeats
const structureCreation = {
  generated: 0,
  notGenerated: 0,
  repeats: [],
  skipped: 0,
  overwritten: { file: 0, folder: 0 }
};

const generationResolver = (structureCreation, contentLineCount, resolve) => {

  if (structureCreation.generated +
    structureCreation.notGenerated + structureCreation.skipped ===
    contentLineCount) {
    resolve(structureCreation);
  }
};

const logNonGenerated = tailCall((linesInfo, structureCreation,
  line, validationResults) => {
  structureCreation.notGenerated += 1;

  const isTopLine = line.isTopLine;

  //Log what is the originating first folder that was
  //not generated
  if (isTopLine) {
    line.firstNonGen = true;
    logValidations(validator.repeatedLines(linesInfo,
      structureCreation, line), validationResults);
  } else if ((line.childOfNonGen !== true &&
      line.parent.firstNonGen !== true)) {
    logValidations(validator.repeatedLines(linesInfo,
      structureCreation, line), validationResults);
  }

  //Repeated lines with further nesting also gets recorded
  if (line.children.length > 0) {
    const nonGeneratedChildren = line.children;
    nonGeneratedChildren.forEach((line) => {
      line.childOfNonGen = true;
      logNonGenerated(linesInfo, structureCreation,
        line, validationResults);
    });
  }
});

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = (linesInfo, lineInfo, rootPath,
  contentLineCount, validationResults, options, resolve, genFailures, onEvtActions) => {

  const {
    structureName,
    inferType,
    nameDetails,
    isTopLine,
    childRepeatedLine,
    repeatedLine
  } = lineInfo;

  const name = nameDetails.sanitizedName ||
    structureName,
    structureRoughPath = path.join(rootPath, name),
    structureCreatePath = normalizePath(structureRoughPath);

  if (inferType === 'file') {
    if (!childRepeatedLine && !repeatedLine) {

      //Track the first of the line's repeats
      if (isTopLine) {
        linesInfo.topLevelIndex[structureName] = lineInfo.nameDetails.line;
      }

      //Create the file type
      const fileCreate = co.wrap(function* wrapFileCreate() {

        try {
          const fileExists = yield statAsync(structureCreatePath);

          //File already exist situation mean it does not error out
          //Overwrite existing files when the flag is provided
          if (fileExists.isFile() &&
          (options && options.forceOverwrite)) {

            yield writeFileAsync(structureCreatePath, '');
            structureCreation.generated += 1;
            structureCreation.overwritten.file += 1;
          } else {

            //Non-generated file
            structureCreation.notGenerated += 1;
          }

          //Console line information for each line
          if (typeof onEvtActions.line !== 'undefined') {
            onEvtActions.line(
              requireMessages
                .onLineOverwritten(lineInfo.nameDetails.line, 'File',
                  structureName));
          }
        } catch (e) {

          //Create the file when there is a stat error
          //this means that the file did not exists
          yield writeFileAsync(structureCreatePath, '');
          structureCreation.generated += 1;

          if (typeof onEvtActions.line !== 'undefined') {
            onEvtActions.line(
              requireMessages
                .onLineGenerated(lineInfo.nameDetails.line, 'File',
                  structureName));
          }
        }

        //When all generated structures are created with the non-generated
        //structures ignored, signifies that the generation process comes to
        //an end
        generationResolver(structureCreation, contentLineCount, resolve);
      });

      co(function* coFileCreate() {
        try {
          yield fileCreate();
        } catch (error) {
          console.log('File creation error:', error);
        }
      });

    } else {
      logNonGenerated(linesInfo, structureCreation,
        lineInfo, validationResults);
    }
  } else {
    const parentPath = path.join(rootPath,
      (nameDetails.sanitizedName || structureName));

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
      const folderCreate = (function* genFolderCreate() {
        try {
          const folderExists = yield statAsync(parentPath);

          //'Overwrite' existing folder when the flag is provided
          //This means that the folder
          //is deleted and then recreated
          if (folderExists.isDirectory() && (options && options.forceOverwrite)) {
            yield removeAsync(parentPath);
            yield ensureDirAsync(parentPath);
            structureCreation.generated += 1;
            structureCreation.overwritten.folder += 1;
          } else {

            // Skip folder generation
            structureCreation.skipped += 1;
          }

          if (typeof onEvtActions.line !== 'undefined') {
            onEvtActions.line(
              requireMessages
                .onLineOverwritten(lineInfo.nameDetails.line, 'Folder',
                  structureName));
          }

        } catch (e) {

          //Create the folder when it does not exists
          yield ensureDirAsync(parentPath);
          structureCreation.generated += 1;

          if (typeof onEvtActions.line !== 'undefined') {
            onEvtActions.line(
              requireMessages
                .onLineGenerated(lineInfo.nameDetails.line, 'Folder',
                  structureName));
          }
        }

        //When all generated structures are created with the non-generated
        //structures ignored with skips accounted for, signifies
        //that the generation process comes to an end
        generationResolver(structureCreation, contentLineCount, resolve);
      });

      co(function* coFolderCreate() {
        try {
          yield folderCreate();
        } catch (error) {
          console.log('Folder creation error:', error);
        }
      });

    }

    const nonGenFolder = !genFolder && (repeatedLine || childRepeatedLine);

    //Ungenerated folder means a repeated line, but still attempt
    //to record the nested child of the repeated line
    if (nonGenFolder) {
      logNonGenerated(linesInfo, structureCreation, lineInfo, validationResults);
    } else if (lineInfo.children.length > 0) {

      //Checks for non-repeated folder
      lineInfo.children.forEach((line) => {

        //Again check for repeated lines in the child level lines
        if (typeof lineInfo.childRepeatedLine === 'undefined' &&
        typeof line !== 'undefined') {
          createStructureTC(linesInfo, line, parentPath,
            contentLineCount, validationResults, options,
            resolve, genFailures, onEvtActions);
        }
      });
    }

  }

};

//Tail call wrapper
createStructureTC = tailCall(createStructure);

//Top level lines kick off and for later child structure creation
const startCreatingAtTopLevel = (linesInfo, rootPath,
  validationResults, actionParams, contentLineCount, options,
  resolve, genFailures, onEvtActions) => {

  //Take the outer-most level of elements which
  //serves as the initial generation set
  for (let i = 0; i < contentLineCount; i++) {
    const topLevelLine = linesInfo.topLevel[i];
    if (typeof topLevelLine !== 'undefined') {
      createStructureTC(linesInfo, topLevelLine, rootPath,
        contentLineCount, validationResults, options, resolve, genFailures, onEvtActions);
    }
  }
};

export default (linesInfo, rootPath, validationResults,
  actionParams, genFailures, onEvtActions) => {

  //Flag definition to allow for changing the defaults values such
  //as allowing for overwriting existing files or folders
  const options = actionParams ? actionParams.options : {};

  //The total number of lines that are possible to generate
  const contentLineCount = linesInfo.contentLineCount;
  return new Promise((resolve, reject) => {

    //Go ahead with the writing of files and folders

    //Take the outer-most level of elements which
    //serves as the initial generation set
    startCreatingAtTopLevel(linesInfo, rootPath, validationResults,
       actionParams, contentLineCount, options, resolve, genFailures, onEvtActions);

  });
};

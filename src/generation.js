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
  removeAsync } from 'fs-extra-promise';

//Source modules
import Validations from './lines-validations';

const validator = new Validations();
const tailCall = recursive.recur;

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = async function (lineInfo, rootPath, firstContentLineIndentAmount, topRepeatsCheck, fromCaller) {

  // console.log("createStructure", createStructure);
  //
  // console.log("topRepeatsCheck", topRepeatsCheck);
  // console.log("firstContentLineIndentAmount", firstContentLineIndentAmount);
  // console.log("lineInfo.nameDetails.indentAmount", lineInfo.nameDetails.indentAmount);


  //lineInfo is a single line
  //Join the path safely by converting all backward
  //slashes to forward slashes
  let structureName = lineInfo.nameDetails.sanitizedName ||
   lineInfo.structureName,
    structureRoughPath = path.join(rootPath, structureName),
    structureCreatePath = normalizePath(structureRoughPath);

  console.log("fromCaller----------------------------", fromCaller);
  // console.log("lineInfo.inferType", lineInfo.inferType);

  if (typeof lineInfo.sibling !== 'undefined' && lineInfo.sibling.length > 0 && firstContentLineIndentAmount === lineInfo.nameDetails.indentAmount &&
  typeof fromCaller === 'undefined') {
    console.log("first level");
    console.log("lineInfo.sibling[0]", lineInfo.sibling[0]);
    writeFileAsync(structureCreatePath);
    lineInfo.sibling[0].forEach((line) => {
      createStructureTC(line, rootPath, firstContentLineIndentAmount, topRepeatsCheck, 'topLevelSiblingCheck');
    });
  } else {


    // console.log("lineInfo", lineInfo);
    if (lineInfo.inferType === 'file') {

      // && levelRepeats[key][levelRepeats.length - 1] === lineInfo.nameDetails.line
      console.log("file structureName", structureName);
      // console.log("topRepeatsCheck", topRepeatsCheck);

      console.log("topRepeatsCheck[structureName]", topRepeatsCheck[structureName]);

      console.log("lineInfo.nameDetails.line", lineInfo.nameDetails.line);
      console.log("lineInfo.nameDetails.indentAmount", lineInfo.nameDetails.indentAmount);

      // if (topRepeatsCheck[structureName][0] === lineInfo.nameDetails.line) {
      //   console.log("last of the repeated line", topRepeatsCheck[key][topRepeatsCheck.length - 1]);
      // }
      writeFileAsync(structureCreatePath);
    } else {
      console.log("folder chec");
      //Folder will be the only other structure type
      let parentPath = path.join(rootPath, (lineInfo.nameDetails.sanitizedName ||
         lineInfo.structureName));

      await mkdirAsync(parentPath);

      //Create children structures if folder has children
      if (lineInfo.children.length > 0) {
          console.log("-has childrennnnnn");

        validator.repeatedLines(
          lineInfo.nameDetails.line,
          lineInfo.children);

        lineInfo.children.forEach((line) => {
          createStructureTC(line, parentPath, firstContentLineIndentAmount, topRepeatsCheck);
        });
      }
    }

  }

  //Only the top-most level need the siblings generation
  console.log("typeof lineInfo.sibling !== 'undefined'", typeof lineInfo.sibling !== 'undefined');
  console.log("lineInfo.sibling.length", lineInfo.sibling.length);
  console.log("firstContentLineIndentAmount === lineInfo.nameDetails.indentAmount", firstContentLineIndentAmount === lineInfo.nameDetails.indentAmount);



  console.log("===========");
};

createStructureTC = tailCall(createStructure);

export
default(linesInfo, rootPath) => {

  (async function dirGen() {

    //Check for root folder
    const hasRootDirAsync = await existsAsync(rootPath);
    if (!hasRootDirAsync) {

      //Create a folder if it does not exists
      await mkdirAsync(rootPath);
    }

    let topRepeatsCheck = validator.topLevelRepeatedLines(
      linesInfo.firstLine,
      linesInfo.prevLineInfo.nameDetails.line);

    console.log("results topRepeatsCheck", topRepeatsCheck);

    createStructureTC(linesInfo.firstLine, rootPath, linesInfo.firstContentLineIndentAmount, topRepeatsCheck);
  })();
};
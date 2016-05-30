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

//Convert createStructure into a tail recursive function
let createStructureTC = null;
const createStructure = async function(lineInfo, rootPath, firstContentLineIndentAmount, topRepeatsCheck, fromCaller) {
};

createStructureTC = tailCall(createStructure);

export default (linesInfo, rootPath) => {

  (async function dirGen() {



    /*
      //Take the outer-most level of elements which
      //serves as the levelElements
      generateCurrentLevel(levelElements)

    */

    // let topRepeatsCheck = validator.topLevelRepeatedLines(
    //   linesInfo.firstLine,
    //   linesInfo.prevLineInfo.nameDetails.line);
    //
    // console.log("results topRepeatsCheck", topRepeatsCheck);
    //
    // createStructureTC(linesInfo.firstLine, rootPath, linesInfo.firstContentLineIndentAmount, topRepeatsCheck);
  })();
};
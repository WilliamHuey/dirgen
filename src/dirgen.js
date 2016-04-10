console.time('timer');

'use strict';

import "babel-polyfill";

//Native Nodejs modules
import readline from 'readline';
import fs from 'fs';

//Source modules
import AddLinesInfo from './lines-info';
import Lexer from './lexer';
import Validations from './validations';
import generateStructure from './generation';

const addLinesInfo = new AddLinesInfo();
const lexer = new Lexer();
const validator = new Validations();

//Track the status of the lines
let linesInfo = {
  prevLineInfo: null,
  currentValue: null,
  contentLineCount: 0,
  totalLineCount: 0,
  firstIndentationType: null,
  firstIndentationAmount: null,
  firstLine: null,
  //firstIndentationAmount will become the
  //indent scaling factor when the first
  //content line does not have an indentation level
  firstContentLineIndentAmount: null,
  requireIndentFactor: false
};

//Read through all the lines of a supplied file
readline.createInterface({
    input: fs.createReadStream(`${process.cwd()}/demo/test.txt`)
  })
  .on('line', (line) => {
    //Get properties from the current line in detail with
    //the lexer
    let lexResults = lexer.lex(line);

    // console.log("linesInfo", linesInfo);

    //Accumulate general information lines
    addLinesInfo.setGeneralData(line, linesInfo);

    //Do not further process a line that is
    //only whitespace or that is without content
    if (line.length === 0 ||
      lexResults.currentTrimmedValue.length === 0) {
      return;
    }

    //Use this object when performing checks
    //with subsequent lines
    let currentLine = {
      structureName: linesInfo.currentTrimmedValue,
      sibling: [],
      parent: null,
      children: [],
      nameDetails: lexResults
    };

    //Get the information from prior lines to determine
    //the siblings, parent, and children key values
    currentLine = addLinesInfo.setLineData(currentLine, linesInfo);

    //Validate the recently set line data
    validator.charCountUnder255(
      currentLine.nameDetails.contentLength,
      linesInfo.totalLineCount,
      currentLine.structureName,
      currentLine.inferType);

    validator.sameIndentType(
      linesInfo.totalLineCount,
      currentLine.structureName,
      linesInfo.firstIndentationType,
      currentLine.nameDetails.indentType);

    validator.cleanFileName(
      linesInfo.totalLineCount,
      currentLine.structureName);

    // console.log("linesInfo", linesInfo);

  })
  .on('close', () => {
    // console.log('closing the file');
    // console.log("linesInfo.firstLine", linesInfo.firstLine, "\n\n");
    // console.log("linesinfo", linesInfo);

    // console.log("linesInfo.firstLine.sibling[0].sibling[0]", linesInfo.firstLine.sibling[0].sibling[0], "\n\n");

    //Hand off general line information
    //to create the actual files and folders

    let rootPath = `${process.cwd()}/demo/root-output/`;

    //But validate the presence of the firstLine
    //if nothing, skip generation
    //presenceFirstLine also sets off the generation
    //validator.<rule>(<data>, <callback>, <callback arguments>)
    validator.presenceFirstLine(
      linesInfo.firstLine, generateStructure, [linesInfo, rootPath]);

    console.log("almost end");
    console.timeEnd('timer');

  });

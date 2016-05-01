'use strict';

//Start timing the whole generation process
let time = process.hrtime();

import "babel-polyfill";

//Native modules
import readline from 'readline';
import fs from 'fs';

//Source modules
import AddLinesInfo from './lines-info';
import Lexer from './lexer';
import Validations from './lines-validations';
import Timer from './process-timer';
import generateStructure from './generation';
import commandTypeAction from './cli-command-type';

const addLinesInfo = new AddLinesInfo();
const lexer = new Lexer();
const validator = new Validations();

//Time the whole process after erroring out
//or by the finishing of generation
(new Timer()).onExit(time);

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

export default (action, actionParams) => {

  //Read through all the lines of a supplied file
  readline.createInterface({
      input: fs.createReadStream(commandTypeAction(action, 'template', actionParams))
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

      //Hand off general line information
      //to create the actual files and folders

      let rootPath = commandTypeAction(action, 'output', actionParams);

      //But validate the presence of the firstLine
      //if nothing, skip generation
      //presenceFirstLine also sets off the generation
      //validator.<rule>(<data>, <callback>, <callback arguments>)
      validator.presenceFirstLine(
        linesInfo.firstLine, generateStructure, [linesInfo, rootPath]);
    });
};
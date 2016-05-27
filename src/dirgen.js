'use strict';

//Start timing the whole generation process
let time = process.hrtime();

import "babel-polyfill";

//Native modules
import readline from 'readline';
import fs from 'fs';
import path from 'path';

//Source modules
import AddLinesInfo from './lines-info';
import Lexer from './lexer';
import Validations from './lines-validations';
import Timer from './process-timer';
import generateStructure from './generation';
import commandTypeAction from './cli-command-type';
import util from './utilities';

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

  //Demo input params are different from typical generation
  let actionDemo = null;
  let execPathDemo = null;
  let creationTemplatePath = '';

  if (util.isObject(action)) {
    actionDemo = action.action;
    execPathDemo = action.execPath;
  }

  if (typeof action.action !== 'undefined') {

    //Demo type generation
    creationTemplatePath = commandTypeAction(action.action, 'template', actionParams, execPathDemo);
  } else {

    //Non-demo generation case
    creationTemplatePath = commandTypeAction(action, 'template', actionParams);
  }

  //Group the errors and warnings together
  //to avoid second pass through if errors
  //and delay warning outputs until the end
  let validationResults = {
    errors: [],
    warnings: []
  };

  let logValidations = (againstRule, summaryValidation) => {

    //ex againstRule = {
    // type: 'error',
      // line: { number: 2, message: 'Line 2 has error on ...'}
    //}
    if (typeof againstRule.type !== 'undefined') {
      if (againstRule.type === 'error') {
        summaryValidation.errors.push(againstRule.line);
      } else if (againstRule.type === 'warning') {
        summaryValidation.warnings.push(againstRule.line);
      }
      if (againstRule.output) {
        return againstRule.output;
      }
    }
  };

  //Read through all the lines of a supplied file
  readline.createInterface({
    input: fs.createReadStream(creationTemplatePath)
    })
    .on('line', (line) => {

      //Get properties from the current line
      //in detail with the lexer
      let lexResults = lexer.lex(line);

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

      /*
      Sample nameDetails output
      { totalLength: 7,
         charPos: 5,
         currentCharCode: 58,
         structureType: null,
         specialCharacters: { '58': [Object] },
         indentAmount: 0,
         indentType: null,
         contentLength: 7,
         currentTrimmedValue: 'thing:s',
         specialCharactersTypeCount: 1,
         line: 1,
         sanitizedName: 'things' } }
      */

      //Get the information from prior lines to determine
      //the siblings, parent, and children key values
      currentLine = addLinesInfo.setLineData(currentLine, linesInfo);

      // console.log("\n\ncurrentLine", currentLine);

      //Validate the recently set line data
      logValidations(
        validator.sameIndentType(
        linesInfo.totalLineCount,
        currentLine.structureName,
        linesInfo.firstIndentationType,
        currentLine.nameDetails.indentType),
      validationResults);

      logValidations(
        validator.charCountUnder255(
          currentLine.nameDetails.contentLength,
          linesInfo.totalLineCount,
          currentLine.structureName,
          currentLine.inferType),
        validationResults);


      //Manipulates the currentLine object
      const sanitizedName =
      logValidations(
       validator.cleanFileName(
        linesInfo.totalLineCount,
        currentLine.structureName,
        currentLine),
      validationResults);

      if (sanitizedName) {
        currentLine.nameDetails.sanitizedName = sanitizedName;
      }

    })
    .on('close', () => {
      // console.log('closing the file');

      //Hand off general line information
      //to create the actual files and folders

      let rootPath = commandTypeAction((actionDemo || action), 'output', actionParams, execPathDemo);

      //But validate the presence of the firstLine
      //if nothing, skip generation
      //presenceFirstLine also sets off the generation
      //validator.<rule>(<data>, <callback>, <callback arguments>)

      // console.log("linesInfo", linesInfo);
      // console.log("linesInfo.firstLine", linesInfo.firstLine);


      // validator.presenceFirstLine(
      //   linesInfo.firstLine, generateStructure, [linesInfo, rootPath]);

      console.log("validationResults", validationResults);
    });
};
'use strict';

//Add support for features in ES2015 as maps and promises
import "babel-polyfill";

//Native modules
import fs from 'fs';
import path from 'path';
import readline from 'readline';

//Source modules
import util from './utilities';

import commandTypeAction from './cli-command-type';
import AddLinesInfo from './lines-info';
import Lexer from './lexer';
import Validations from './lines-validations';
import message from './validations-messages';
import logValidations from './log-validations';
import printValidations from './print-validations';
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
  requireIndentFactor: false,
  topLevel: [],
  topLevelIndex: {}
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
      currentLine = addLinesInfo.setLineData(currentLine, linesInfo,
        validationResults);

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
      //to use for later generation
      const sanitizedName =
        logValidations(
          validator.cleanFileName(
            currentLine.nameDetails.specialCharactersTypeCount,
            linesInfo.totalLineCount,
            currentLine.structureName,
            currentLine),
          validationResults);

      if (sanitizedName) {
        currentLine.nameDetails.sanitizedName = sanitizedName;
      }

    })
    .on('close', () => {

      (async function () {

        // console.log("linesInfo", linesInfo);

        //Determine the output filepath of the generated
        let rootPath = commandTypeAction((actionDemo || action),
          'output', actionParams, execPathDemo);

        //Should not be generated with no lines in the file
        const hasContent = logValidations(
          validator.presenceFirstLine(
            linesInfo.firstLine),
          validationResults);

        //Last stage before generation with status check
        if (hasContent) {
          let errors = validationResults.errors;
          if (errors.length > 0) {

            printValidations(message, 'error', errors, errors.length);

            //Print all errors first and than any warnings
            printValidations(message, 'warn',
              validationResults.warnings, validationResults.warnings.length);
          } else {

            //Generate the content
            //Async nature will need the later logging to be delay

            // console.log("linesInfo", linesInfo);

            await generateStructure(linesInfo, rootPath, validationResults);

            // console.log("validationResults", validationResults);

            //Print out warning message
            printValidations(message, 'warn',
              validationResults.warnings, validationResults.warnings.length);
          }
        } else {

          //No content in the template file produces only one error
          message.error(validationResults.errors[0].message);
        }

        console.log(`Template read: ${validationResults.errors.length} errors and ${validationResults.warnings.length} warnings`);

      })();
    });
};

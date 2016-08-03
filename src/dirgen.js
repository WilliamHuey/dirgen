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

//Start timing the write process
let time = process.hrtime();
let timeDiff;

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

      //Sanitized name will be logged and used
      //over the original name
      if (sanitizedName) {
        currentLine.nameDetails.sanitizedName = sanitizedName;
      }

      logValidations(
        validator.sameLineMixedTabsAndSpaces(currentLine.nameDetails.mixedTabsSpaces, currentLine.nameDetails.line, currentLine.structureName),
        validationResults);
    })
    .on('close', () => {

      //For displaying the count of the generated and the non-generated
      let genResult = null;

      //Log the failed to generate files or folders
      let genFailures = [];

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

        console.log("actionParams", actionParams);


        let hideMessages;
        if (typeof actionParams === 'undefined') {
          hideMessages = false;
        } else {
          hideMessages = actionParams.options.hideMessages;
        }

        //Last stage before generation with status check
        if (hasContent) {
          let errors = validationResults.errors;
          if (errors.length > 0 && !hideMessages) {

            printValidations(message, 'error', errors, errors.length);

            //Print all errors first and than any warnings
            printValidations(message, 'warn',
              validationResults.warnings, validationResults.warnings.length);
          } else {

            //Generate the content
            //Async nature will need the later logging to be delay

            genResult = await generateStructure(linesInfo, rootPath, validationResults, actionParams, genFailures);

            //Time the generation only
            timeDiff = process.hrtime(time);

            if (!hideMessages) {
              //Print out warning message
              printValidations(message, 'warn',
                validationResults.warnings, validationResults.warnings.length);
            }

          }
        } else {

          if (!hideMessages) {
            //No content in the template file produces only one error
            message.error(validationResults.errors[0].message);
          }
        }

        console.log(`Template info: ${linesInfo.totalLineCount} total lines (${linesInfo.contentLineCount} content, ${linesInfo.totalLineCount - linesInfo.contentLineCount} blanks)`);

        console.log(`Template read: ${validationResults.errors.length} errors and ${validationResults.warnings.length} warnings`);

        //Non-generated count can be larger than the warning count
        //because the warning logging stops checking items for the top-most repeated folder

        //When there is an error log, genResult is null
        if (genResult === null) {
          console.log(`Creation count: 0 generated, ${linesInfo.contentLineCount} not generated, 0 skipped`);
        } else {
          console.log(`Creation count: ${genResult.generated} generated, ${genResult.notGenerated} not generated, ${genResult.skipped} skipped`);
        }

        console.log(`Generation failures: ${genFailures.length} write errors`);

        //On error conditions, no timeDiff is needed
        if (timeDiff && genResult.generated > 0) {
          console.log('Write time: %d nanoseconds', timeDiff[0] * 1e9 + timeDiff[1]);
        } else {
          console.log('Write time: %d nanoseconds', 0);
        }

      })();
    });
};

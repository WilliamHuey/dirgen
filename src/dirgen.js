'use strict';

//Native modules
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import co from 'co';

//Source modules
import util from './utilities';
import commandTypeAction from './cli-command-type';
import addLinesInfo from './lines-info';
import lexer from './lexer';
import validator from './lines-validations';
import message from './validations-messages';
import logValidations from './log-validations';
import printValidations from './print-validations';
import generateStructure from './generation';

//Start timing the write process
let timeDiff;

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

const dirgen = function(action, actionParams, fromCli) {
  //Demo input params are different from typical generation
  let actionDemo = null;
  let execPathDemo = null;
  let creationTemplatePath = '';

  console.log("action is now ", action);

  if (util.isObject(action)) {
    actionDemo = action.action;
    execPathDemo = action.execPath;
  }

  if (typeof action.action !== 'undefined' &&
   !actionParams.settings) {
     console.log("for demo ");
    //Demo type generation
    creationTemplatePath = commandTypeAction(action.action,
      'template', actionParams, execPathDemo);
  } else {

    console.log("gen action", action);
    console.log("gen actionParams", actionParams);
    if (actionParams.settings) {

      console.log("require use");

      //Reformat the actionParams object
      let requiredActionParams = {};
      let {output, template, options} = actionParams.settings;
      Object.assign(requiredActionParams, {output, template, options})
      actionParams = requiredActionParams;

      //From 'require' use
      creationTemplatePath = commandTypeAction(action, 'template', actionParams);
    } else {

      //From cli - Non-demo generation case
      creationTemplatePath = commandTypeAction(action, 'template', actionParams);
    }
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
        validator.sameLineMixedTabsAndSpaces(
          currentLine.nameDetails.mixedTabsSpaces,
           currentLine.nameDetails.line,
          currentLine.structureName),
        validationResults);
    })
    .on('close', () => {

      //For displaying the count of the generated and the non-generated
      let genResult = null;

      //Log the failed to generate files or folders
      let genFailures = [];

      (function(co) {

        co(function* () {
          try {
            yield co.wrap(function* () {

              //Determine the output filepath of the generated
              let rootPath = commandTypeAction((actionDemo || action),
                'output', actionParams, execPathDemo);

              //Should not be generated with no lines in the file
              const hasContent = logValidations(
                validator.presenceFirstLine(
                  linesInfo.firstLine),
                validationResults);

              let hideMessages;
              if (typeof actionParams === 'undefined') {
                hideMessages = false;
              } else if (actionParams !== true) {
                hideMessages = actionParams.options.hideMessages;
              }

              //Demo situation, need to swap action with actionParams
              //also vice-versa
              let demoActionParams = null;
              let normalizedActionParams = null;
              if (util.isObject(action)) {
                demoActionParams = {};
                demoActionParams.template = action.execPath;
                demoActionParams.options = action.options;
                demoActionParams.output = rootPath;
                normalizedActionParams = demoActionParams;
              }

              //Non-demo params, generate command
              if (normalizedActionParams === null) {
                normalizedActionParams = actionParams;
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
                  let time = process.hrtime();

                  genResult = yield generateStructure(linesInfo, rootPath,
                     validationResults, normalizedActionParams, genFailures);

                  //Time the generation only
                  timeDiff = process.hrtime(time);

                  if (!hideMessages) {
                    //Print out warning message
                    printValidations(message, 'warn',
                      validationResults.warnings,
                      validationResults.warnings.length);
                  }
                }
              } else {
                if (!hideMessages) {

                  //No content in the template file produces only one error
                  message.error(validationResults.errors[0].message);
                }
              }

              console.log(`Template info: ${linesInfo.totalLineCount} total ${util.pluralize('line', linesInfo.totalLineCount)} (${linesInfo.contentLineCount} content, ${linesInfo.totalLineCount - linesInfo.contentLineCount} ${util.pluralize('blank', linesInfo.totalLineCount)})`);

              console.log(`Template read: ${validationResults.errors.length} ${util.pluralize('error', validationResults.errors.length)} and ${validationResults.warnings.length} ${util.pluralize('warning', validationResults.warnings.length)}`);

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
          } catch (error) {
            console.log("Close file and generation error:", error);
          }
        });

      })(co);
    });
};

export default function (action, actionParams, fromCli) {

  if (!fromCli && action.action !== 'demo') {
    console.log("!fromCli", fromCli);
    [actionParams, action] = [action, actionParams];
    action = actionParams.action;
    console.log("action", action);
    console.log("actionParams", actionParams);
    this.on = function() {
      console.log("stuff happens");
    };
    dirgen(action, actionParams, fromCli);
    return this;
  } else {
    dirgen(action, actionParams, fromCli);
  }

};

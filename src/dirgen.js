'use strict';

//Native modules
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import os from 'os';

//Vendor modules
import co from 'co';
import { statAsync } from 'fs-extra-promise';

//Source modules
import util from './utilities';
import commandTypeAction from './cli-command-type';
import addLinesInfo from './lines-info';
import lexer from './lexer';
import validator from './lines-validations';
import message from './validations-messages';
import initializeMsg from './option-validations-messages';
import logValidations from './log-validations';
import printValidations from './print-validations';
import optionsValidator from './option-validations';
import generateStructure from './generation';

// console.log('optionsValidator', optionsValidator);

//Generation timing for the write process
let timeDiff;

let dirgenExported = () => {};

//Track the status of the lines
const linesInfo = {
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

//Actions for the 'on' function of 'generate'
const onEvtActions = {};

//Group the errors and warnings together
//to avoid second pass through if errors
//and delay warning outputs until the end
const validationResults = {
  errors: [],
  warnings: []
};

//Convert the tilde in the output path to the
//actual home directory when present at the first
//of the line
const convertHome = (outPath) => {
  if (outPath.indexOf('~') === 0) {
    return os.homedir() + outPath.slice(1);
  } else {
    return outPath;
  }
};

//Check for when the error or warning messages should be hidden or not
const shouldHideMessages = (actionParams) => {

  if (typeof actionParams === 'undefined') {
    return false;
  } else if (typeof actionParams.options === 'undefined') {
    return false;
  } else if (actionParams.options.hideMessages === false) {
    return false;
  } else if (actionParams.options.hideMessages === true) {
    return true;
  } else if (typeof actionParams.options.hideMessages !== 'undefined' &&
   actionParams.options.hideMessages !== true) {

    validationResults.errors.push(initializeMsg.invalidHideMessageMsg);
    message.error(initializeMsg.invalidHideMessageMsg);
    return 'invalid';
  }
};

const dirgen = (action, actionParams, fromCli) => {

  console.log('fromCli', fromCli);

  console.log('actionParams', actionParams);


  if (typeof actionParams !== 'undefined' &&
   actionParams.settings) {
    console.log('found the on done');
    onEvtActions.done = actionParams.settings.on.done;
  }

  //Demo input params are different from typical generation
  let actionDemo = null;
  let execPathDemo = null;
  let creationTemplatePath = '';

  if (util.isObject(action)) {
    console.log('setting the actions');
    actionDemo = action.action;
    execPathDemo = action.execPath;
  }

  console.log('action', action);
  console.log('actionDemo', action.action);
  console.log('execPathDemo', execPathDemo);

  if (typeof action.action !== 'undefined' &&
   typeof actionParams === 'undefined') {

     console.log('demo gen');

    //Demo type generation
    creationTemplatePath = commandTypeAction(action.action,
      'template', actionParams, execPathDemo);
  } else if (actionParams.settings) {

    //Reformat the actionParams object
    const requiredActionParams = {};
    let { output } = actionParams.settings;
    const { template, options } = actionParams.settings;

    //Check for home directory for output path
    output = convertHome(output);
    Object.assign(requiredActionParams, { output, template, options });
    actionParams = requiredActionParams;

    console.log('actionParams', actionParams);

    if (actionParams.options && !fromCli) {
      console.log('!fromCli');
      const validatedOptionsResult = optionsValidator.validateOptions(actionParams);
      console.log('validatedOptionsResult', validatedOptionsResult);
      if (validatedOptionsResult.error) {

        console.log('error is found');
        const optionsValidatedOutputMsg = optionsValidator.message(validatedOptionsResult);

        console.log('optionsValidatedOutputMsg optionsValidatedOutputMsg', optionsValidatedOutputMsg);

        // console.log('onEvtActions', onEvtActions);

        if (onEvtActions.done) {
          console.log('onEvtActions.done', onEvtActions.done);
          onEvtActions.done({ errors: [optionsValidatedOutputMsg.invalidValidForceMsg] });
        }
        return;
      }

      if (onEvtActions.done) {
        console.log('onEvtActions.done', onEvtActions.done);
        onEvtActions.done({ errors: [] });
      }

    }

    //From 'require' use
    creationTemplatePath = commandTypeAction(action, 'template', actionParams);
  } else {
    console.log('---------------- from cli non-demo');
    //From cli - Non-demo generation case
    creationTemplatePath = commandTypeAction(action, 'template', actionParams);
  }

  //Check if the template file is valid
  const templateCheck = co.wrap(function* wrapTemplateCheck() {

    let validTemplate = false;
    try {
      validTemplate = true;
      const fileStat = yield statAsync(creationTemplatePath);
    } catch (error) {
      if (typeof error.code !== 'undefined') {
        validTemplate = false;
      } else {
        validTemplate = true;
      }
    } finally {
      return validTemplate;
    }
  });

  co(function* coTemplateCheck() {

    const isValidTemplate = yield templateCheck();

    //Skip the reading and generation when the file is not valid
    if (isValidTemplate !== true) {

      const hideMessageResult = !shouldHideMessages(actionParams);

      if (hideMessageResult === 'invalid') {
        return;
      } else if (hideMessageResult) {
        message.error(initializeMsg.inValidTemplateMsg);
      }

      //Run the 'done' callback
      if (onEvtActions.done) {
        onEvtActions.done({ errors: [initializeMsg.inValidTemplateMsg] });
      }
      return;
    }

    //Read through all the lines of a supplied file
    readline.createInterface({
        input: fs.createReadStream(creationTemplatePath)
      })
      .on('line', (line) => {
        // console.log('line :', line);

        //Get properties from the current line
        //in detail with the lexer
        const lexResults = lexer.lex(line);

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

        console.log('---------close onEvtActions', onEvtActions);

        //For displaying the count of the generated and the non-generated
        let genResult = null;

        //Log the failed to generate files or folders
        const genFailures = [];

        (function coGenerateIif(co) {

          co(function* coGenerate() {
            try {
              yield co.wrap(function* coWrapGenerate() {

                console.log('coGenerate');

                //Determine the output filepath of the generated
                const rootPath = commandTypeAction((actionDemo || action),
                  'output', actionParams, execPathDemo);

                //Should not be generated with no lines in the file
                const hasContent = logValidations(
                  validator.presenceFirstLine(
                    linesInfo.firstLine),
                  validationResults);

                const hideMessages = shouldHideMessages(actionParams);

                //Demo situation, need to swap action with actionParams
                //also vice-versa
                let demoActionParams = null;
                let normalizedActionParams = null;

                console.log('action', action);
                if (util.isObject(action)) {
                  demoActionParams = {};
                  demoActionParams.template = action.execPath;
                  demoActionParams.options = action.options;
                  demoActionParams.output = rootPath;
                  normalizedActionParams = demoActionParams;

                  console.log('demo settings');

                  console.log('normalizedActionParams', normalizedActionParams);
                }

                //Non-demo params, generate command
                if (normalizedActionParams === null) {
                  normalizedActionParams = actionParams;
                }

                //Last stage before generation with status check
                if (hasContent) {
                  const errors = validationResults.errors;
                  if (errors.length > 0 && !hideMessages) {

                    printValidations(message, 'error', errors, errors.length);

                    //Print all errors first and than any warnings
                    printValidations(message, 'warn',
                      validationResults.warnings, validationResults.warnings.length);
                  } else {

                    //Generate the content
                    //Async nature will need the later logging to be delay
                    const time = process.hrtime();

                    let validRootPath = true;
                    try {
                      const folderStat = yield statAsync(rootPath);
                    } catch (error) {
                      if (typeof error.code !== 'undefined') {
                        validRootPath = false;
                      }
                    }

                    //Skip the generation when directory output is invalid
                    if (!validRootPath) {
                      if (!shouldHideMessages(actionParams)) {
                        message.error(initializeMsg.invalidOutputDirMsg);
                      }

                      //Run the 'done' callback
                      if (onEvtActions.done) {
                        onEvtActions.done({ errors: [initializeMsg.invalidOutputDirMsg] });
                      }
                      return;
                    }

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
                } else if (!hideMessages) {

                  //No content in the template file produces only one error
                  message.error(validationResults.errors[0].message);
                }

                console.log(`Template info: \
${linesInfo.totalLineCount} total \
${util.pluralize('line', linesInfo.totalLineCount)} \
(${linesInfo.contentLineCount} content, \
${linesInfo.totalLineCount - linesInfo.contentLineCount} \
${util.pluralize('blank', linesInfo.totalLineCount)})`);

                console.log(`Template read: \
${validationResults.errors.length} \
${util.pluralize('error',
validationResults.errors.length)} and \
${validationResults.warnings.length} \
${util.pluralize('warning',
validationResults.warnings.length)}`);

                //Non-generated count can be larger than the warning count
                //because the warning logging stops checking items for the top-most repeated folder

                //When there is an error log, genResult is null
                if (genResult === null) {
                  console.log(`Creation count: 0 generated, \
${linesInfo.contentLineCount} not \
generated, 0 skipped`);
              } else {
                console.log(`Creation count: \
${genResult.generated} generated, \
${genResult.notGenerated} not generated, \
${genResult.skipped} skipped`);
                }

                console.log(`Generation failures: ${genFailures.length} write errors`);

                //On error conditions, no timeDiff is needed
                if (timeDiff && genResult.generated > 0) {
                  console.log('Write time: %d nanoseconds', (timeDiff[0] * 1e9) + timeDiff[1]);
                } else {
                  console.log('Write time: %d nanoseconds', 0);
                }

                //For the 'on' callback of 'done' to indicate the generation
                //or processing is complete, but running Dirgen from the
                //cli will trigger a 'done' callback
                if (onEvtActions.done) onEvtActions.done(validationResults);

              })();
            } catch (error) {
              console.log('Close file and generation error:', error);
            }
          });

        })(co);
      });

      return dirgen;
  });

};


dirgenExported = (action, actionParams, fromCli) => {

  if (!fromCli && action.action !== 'demo') {
    [actionParams, action] = [action, actionParams];
    action = actionParams.action;

    console.log('--------------------requ');

    dirgen(action, actionParams, fromCli);
  } else {
    // console.log('from file');
    dirgen(action, actionParams, fromCli);
  }

};


module.exports = dirgenExported;

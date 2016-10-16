//Vendor modules
import includes from 'array-includes';

//Source modules
import util from './utilities';
import requireValidationMessages from './require-validations-messages';
import message from './validations-messages';

const requireErrorMap = {
  forceOverwrite: 'invalidValidForceMsg',
  hideMessages: 'invalidHideMessageMsg',
  template: 'noTemplateMsg',
  output: 'noOutputDirMsg'
};

const optionsValidator = () => {};

const validOptionsChoices = ['forceOverwrite', 'hideMessages'];

const validateOptions = Object.assign(optionsValidator.prototype, {
  forceOverwrite: (params) => {
    return util.isBoolean(params.forceOverwrite);
  },
  hideMessages: (params) => {
    return util.isBoolean(params.hideMessages);
  },
  message: (validationResult) => {

    const requireErrors = [];
    const validationEntries = validationResult.error || validationResult;

    validationEntries.forEach((error) => {
      const requireErrorMsg = requireValidationMessages[requireErrorMap[error]];
      requireErrors.push(requireErrorMsg);
      message.error(requireErrorMsg);
    });

    return requireErrors;
  },
  validateInputOutput: (template, output) => {
    const validatedResult = [];
    if (typeof template === 'undefined') {
      validatedResult.push('template');
    }
    if (typeof output === 'undefined') {
      validatedResult.push('output');
    }
    return validatedResult;
  },
  validateOptions: (params) => {
    const optionTypes = [];
    let validatedResult = {};

    //Go through all the option keys that are present in the 'validateOptions' object
    Object.keys(params.options).forEach((key) => {
      if (typeof validateOptions[key] !== 'undefined' &&
        includes(validOptionsChoices, key)) {
        const validatedResults = validateOptions[key](params.options);

        //'False' means the option fails validation and will need to be logged
        if (!validatedResults) {

          if (optionTypes.length === 0) {
            validatedResult = { error: optionTypes };
          }

          validatedResult.error.push(key);
        }
      }
    });

    return validatedResult;
  }
});

export default validateOptions;
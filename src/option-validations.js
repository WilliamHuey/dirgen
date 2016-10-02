//Source modules
import util from './utilities';
import optionMessages from './option-validations-messages';
import message from './validations-messages';

const optionErrorMap = {
  forceOverwrite: 'invalidValidForceMsg',
  hideMessages: 'invalidHideMessageMsg'
};

const optionsValidator = () => {};

const validateOptions = Object.assign(optionsValidator.prototype, {
  forceOverwrite: (params) => {
    return util.isBoolean(params.forceOverwrite);
  },
  hideMessages: (params) => {
    return util.isBoolean(params.hideMessages);
  },
  message: (validationResult) => {

    const optionErrors = [];

    validationResult.error.forEach((error) => {
      const optionErrorMsg = optionMessages[optionErrorMap[error]];
      optionErrors.push(optionErrorMsg);
      message.error(optionErrorMsg);
    });

    return optionErrors;
  },
  validateOptions: (params) => {
    const optionTypes = [];
    let validatedResult = {};

    //Go through all the option keys that are present in the 'validateOptions' object
    Object.keys(params.options).forEach((key) => {
      if (typeof validateOptions[key] !== 'undefined') {
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
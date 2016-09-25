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

    console.log('forceoverwrite params', params);
    return util.isBoolean(params.forceOverwrite);
  },
  message: (validationResult) => {
    console.log('validationResult', validationResult);

    const optionErrors = [];

    validationResult.error.forEach((error) => {
      const optionErrorMsg = optionMessages[optionErrorMap[error]];
      optionErrors.push(optionErrorMsg);
      message.error(optionErrorMsg);
    });

    return optionMessages;
  },
  validateOptions: (params) => {
    const optionTypes = [];
    let validatedResult = {};

    console.log('before loop params', params);

    //Got through all the rules defined above 'validateOption'
    Object.keys(validateOptions).forEach((key) => {
      if (key !== 'validateOptions' &&
          key !== 'message') {
        const validatedResults = validateOptions.forceOverwrite(params.options);

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
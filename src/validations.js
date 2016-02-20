'use strict';

//Vendor modules
import _ from 'lodash';
/*
**VALIDATIONS

general all around validator
  -file characters
  -indent levels

lexer
  encoding setting
  character restrictions
    255 length as upper limit for all oses
    specific reserved characters

When the file does not have any content

Invalid characters - os specific checks

repeated lines check - warn for overwrite

two level of severity, warning and errors

*/

let validator = () => {};

_.assign(validator.prototype, {
  presenceFirstLine: (linesInfo, callback, rootPath) => {

    if (!_.isNull(linesInfo.firstLine)) {
      callback.call(null, linesInfo, rootPath);
    }

    //TODO: throw a warning message
    //Does the pretty error module
    //support warning level errors
  }
});

export default validator;
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
  presenceFirstLine: (linesInfo, callback) => {

    if (!_.isNull(linesInfo.firstLine)) {
      callback.call(null, linesInfo);
    }
  }
});

export default validator;
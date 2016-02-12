'use strict';

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

Invalid characters - os specific checks

repeated lines check - warn for overwrite

two level of severity, warning and errors


*/

export default function validator(property) {

  console.log("validating property", property);
}
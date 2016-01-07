'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

//Native Nodejs modules

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

//Vendor modules

var _unlimited = require('unlimited');

var _unlimited2 = _interopRequireDefault(_unlimited);

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

//Source modules

var _linesInfo = require('./lines-info');

var _linesInfo2 = _interopRequireDefault(_linesInfo);

var _lexerJs = require('./lexer.js');

var _lexerJs2 = _interopRequireDefault(_lexerJs);

var _validations = require('./validations');

var _validations2 = _interopRequireDefault(_validations);

//Track the status of the lines
console.time('timer');
(0, _unlimited2['default'])(10000);

var addLinesInfo = new _linesInfo2['default']();

var lexer = new _lexerJs2['default']();

var linesInfo = {
  previousValue: null,
  currentValue: null,
  lineCount: 0,
  actualLineCount: 0,
  firstIndentationType: null,
  firstIndentationAmount: null
};

//Read through all the lines of a supplied file
var reader = _readline2['default'].createInterface({
  input: _fs2['default'].createReadStream('/Users/williamhuey/Desktop/Coding/JavaScript/npm-modules/dirgen/src/test.txt')
});

reader.on('line', function (line) {

  //Get properties from the current line
  var lexResults = lexer.lex(line);

  addLinesInfo.setData(line, linesInfo);

  // console.log("linesInfo", linesInfo);

  //Lexer returns information about the line structure type
  //but still verify if the prior line
  //could be confirm as a folder or a file type
  // if (linesInfo.previousValue === null) {
  //   linesInfo.currentValue = line;
  // } else {
  //   //
  //
  // }

  //Validate right here to verify if the lexed
  //line markings info syncs with the indentation levels
  //actually going to validate the previous line
  //when on the current line

  /*
  sample node construction
  stuff
  thing
  others
   {value: 'stuff', siblings: null, children: null, indentationLevel: null}}
  {value: 'thing', siblinsg: ref to stuff object, indentationLevel}
   what do I really need to make sure the chain ref can not be lost?
   linesInfo = {
    lastRef: 'the object ref'
  }
    */

  /*
   STEPS
   Count lines
   Get line info (lexer)
    File type / Validation
    Indentation / Validation
   Confirm file type
   Build tree
  Read tree
    create folder directories
   Build the tree incrementally
  Instantiate a tree object that will be able to
  monitor itself
   */
});

reader.on('close', function () {
  console.log('closing the file');

  console.log("validator ", _validations2['default']);
  console.log("linesInfo", linesInfo);
  //Start generating the folders based on the b-tree
});

console.timeEnd('timer');
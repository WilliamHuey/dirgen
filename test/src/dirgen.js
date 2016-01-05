'use strict';

console.time('timer');

//Native Nodejs modules
import readline from 'readline';
import fs from 'fs';

//Vendor modules
import unlimited from 'unlimited';
unlimited(10000);

import PrettyError from 'pretty-error';

//Source modules
import AddLinesInfo from './lines-info';
let addLinesInfo = new AddLinesInfo();

import Lexer from './lexer.js';
const lexer = new Lexer();

import validator from './validations';

//Track the status of the lines
let linesInfo = {
  previousValue: null,
  currentValue: null,
  lineCount: 0,
  actualLineCount: 0,
  firstIndentationType: null,
  firstIndentationAmount: null
};

//Read through all the lines of a supplied file
const reader = readline.createInterface({
  input: fs.createReadStream('/Users/williamhuey/Desktop/Coding/JavaScript/npm-modules/dirgen/src/test.txt')
});

reader.on('line', line => {

  //Get properties from the current line
  let lexResults = lexer.lex(line);

  console.log("addLinesInfo", addLinesInfo.setData(line, linesInfo));

  //Lexer returns information about the line structure type
  //but still verify if the prior line
  //could be confirm as a folder or a file type
  if (linesInfo.previousValue === null) {
    linesInfo.currentValue = line;
  } else {
    //

  }

  //Validate right here to verify if the lexed
  //line markings info syncs with the indentation levels
  //actually going to validate the previous line
  //when on the current line





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

reader.on('close', function() {
  console.log('closing the file');

  console.log("validator ", validator);
  console.log("linesInfo", linesInfo);
  //Start generating the folders based on the b-tree
});

console.timeEnd('timer');
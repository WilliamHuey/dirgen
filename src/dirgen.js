console.time('timer');

/*
  TODO:

  **VALIDATIONS
  **INDENT LEVEL FACTOR
  **GENERATION
  **COMMAND LINE

*/
'use strict';

//Native Nodejs modules
import readline from 'readline';
import fs from 'fs';

//Vendor modules
import unlimited from 'unlimited';
import PrettyError from 'pretty-error';

//Source modules
import AddLinesInfo from './lines-info.js';
const addLinesInfo = new AddLinesInfo();
import Lexer from './lexer.js';
import validator from './validations.js';

unlimited(10000);
const lexer = new Lexer();

//Track the status of the lines
let linesInfo = {
  prevLineInfo: null,
  currentValue: null,
  contentLineCount: 0,
  totalLineCount: 0,
  firstIndentationType: null,
  firstIndentationAmount: null
};

//Read through all the lines of a supplied file
readline.createInterface({
    input: fs.createReadStream('/Users/williamhuey/Desktop/Coding/JavaScript/npm-modules/dirgen/src/test.txt')
  })
  .on('line', line => {
    // console.log("process line prevLineInfo", prevLineInfo);

    //Get properties from the current line in detail with
    //the lexer
    let lexResults = lexer.lex(line);

    //Accumulate general information lines
    addLinesInfo.setGeneralData(line, linesInfo);

    //Do not further process a line that is
    //only whitespace or that is without content
    if (line.length === 0 ||
      lexResults.currentTrimmedValue.length === 0) return;

    //Use this object when performing checks
    //with subsequent lines
    let currentLine = {
      structureName: linesInfo.currentTrimmedValue,
      sibling: [],
      parent: null,
      children: [],
      inferType: null,
      nameDetails: lexResults
    };

    // console.log("lexResults", currentLine.nameDetails);

    //Get the information from prior lines to determine
    //the siblings, parent, and children key values
    addLinesInfo.setLineData(currentLine, linesInfo);



    //Validate the recently set line data

    // console.log("linesInfo", linesInfo);

    // console.log("process the line");

    //Save the line data object reference for future comparison
    //by updating previous value with current


  })
  .on('close', () => {
    console.log('closing the file');



    //
    // console.log("validator ", validator);
    // console.log("linesInfo.firstLine.sibling", linesInfo.firstLine.sibling[0].children[0].sibling[0].sibling[0].sibling[0].sibling[0]);
    //Start generating the folders based on the b-tree
    console.timeEnd('timer');
  });
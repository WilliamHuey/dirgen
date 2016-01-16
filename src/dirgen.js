'use strict';

console.time('timer');

//Native Nodejs modules
let readline = require('readline');
let fs = require('fs');

//Vendor modules
let unlimited = require('unlimited');
unlimited(10000);
let PrettyError = require('pretty-error');

//Source modules
let AddLinesInfo = require('./lines-info.js');
let addLinesInfo = new AddLinesInfo();
let Lexer = require('./lexer.js');
console.log("lexer is ", Lexer);

const lexer = new Lexer();
let validator = require('./validations.js');

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

let prevNode = null;

reader.on('line', line => {
  let nodeLine = {};
  //Get properties from the current line in detail
  let lexResults = lexer.lex(line);

  console.log("lexResults", lexResults);

  //Accumulate information for the current line
  //as well as for all lines
  addLinesInfo.setData(line, linesInfo);

  // most likely have
  //
  // {val, siblings, parent, childrens}



  // console.log("linesinfo is now ", linesInfo);

  //Start creating nodes for files and folders
  if (prevNode === null) {
    linesInfo.currentValue = line;

    console.log("prevNode is ", prevNode);

    prevNode = {
      trimmedValue: linesInfo.trimmedValue,
      indentAmount: linesInfo.indentAmount
    };

  } else {



    nodeLine.indentAmount = lexResults.indentAmount;

    /*



    //Example of node reference
    // will still need to get the
    //ref of the parent from the children


    var prevnode = {mark: null};

    var a = {stuff: 'things'};

    prevnode.mark = a;

    console.log('prevnode', prevnode);

    var b = {what: 'stuff'};

    prevnode.mark.sibling = b;

    console.log('a is now ', a );

    console.log('later a is ', a);

    prevnode.mark = b;

    console.log('mark is now ', prevnode);

    console.log('third check a is ', a);

    */


    // prevNode.children
  }

  //Validate right here to verify if the lexed
  //line markings info syncs with the indentation levels

  //current line check for invalid values
  //prior lines will be check for it stated/supposed structure type
  //validate(lines, linesinfo)





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
console.time('timer');

'use strict';

//Native Nodejs modules
import readline from 'readline';
import fs from 'fs';

//Source modules
import AddLinesInfo from './lines-info';
const addLinesInfo = new AddLinesInfo();
import Lexer from './lexer';
import Validations from './validations';
import generateStructure from './generation';

const lexer = new Lexer();
const validator = new Validations();

//Track the status of the lines
let linesInfo = {
  prevLineInfo: null,
  currentValue: null,
  contentLineCount: 0,
  totalLineCount: 0,
  firstIndentationType: null,
  firstIndentationAmount: null,
  firstLine: null
};

//Read through all the lines of a supplied file
readline.createInterface({
    input: fs.createReadStream(`${process.cwd()}/demo/test.txt`)
  })
  .on('line', (line) => {
    // console.log("process line prevLineInfo", prevLineInfo);

    //Get properties from the current line in detail with
    //the lexer
    let lexResults = lexer.lex(line);

    //Accumulate general information lines
    addLinesInfo.setGeneralData(line, linesInfo);

    //Do not further process a line that is
    //only whitespace or that is without content
    if (line.length === 0 || lexResults.currentTrimmedValue.length === 0) {
      return;
    }

    //Use this object when performing checks
    //with subsequent lines
    let currentLine = {
      structureName: linesInfo.currentTrimmedValue,
      sibling: [],
      parent: null,
      children: [],
      nameDetails: lexResults
    };

    // console.log("lexResults", currentLine.nameDetails);

    //Get the information from prior lines to determine
    //the siblings, parent, and children key values
    addLinesInfo.setLineData(currentLine, linesInfo);

    //Validate the recently set line data

    // console.log("process the line", currentLine);

  })
  .on('close', () => {
    console.log('closing the file');
    // console.log("linesInfo.firstLine", linesInfo.firstLine, "\n\n");
    // console.log("linesinfo", linesInfo);

    //Hand off general line information
    //to create the actual files and folders

    let rootPath = `${process.cwd()}/demo/root-output/`;

    //But validate the presence of the firstLine
    //if nothing, skip generation
    validator.presenceFirstLine(linesInfo.firstLine, generateStructure, [linesInfo, rootPath]);

    // console.log("validator ", validator);
    console.timeEnd('timer');

  });

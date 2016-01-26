'use strict';

import _ from 'lodash';
import guard from 'guard-js';

let data = {};
let linesInfo = () => {};

const linesInfoFunctions = {
  currentValue: () => {
    data.lineSetInfo.currentValue = data.line;
  },
  trimmedValue: () => {
    data.lineSetInfo.currentTrimmedValue = data.line.trim();
  },
  countLines: (lineInfo) => {
    let processFurther = false;
    //The actual line number involves counting all lines,
    //but the lines with content may differ
    //However, the count the lines with content on them is more important
    data.lineSetInfo.totalLineCount++;
    if (lineInfo.length > 0 && lineInfo.trimLength > 0) {
      data.lineSetInfo.contentLineCount++;
      processFurther = true;
    }
    return processFurther;
  }
};

const singleLineInfoFunctions = {
  setFirstPrev: (linesInfo, currentLine) => {
    if (linesInfo.prevLineInfo === null) {
      linesInfo.prevLineInfo = currentLine;
      //Also set the first actual content line encounter
      linesInfo.firstLine = currentLine;
    }
  },
  indentation: (linesInfo, currentLine) => {
    if (linesInfo.firstIndentationType === null && currentLine.nameDetails.indentType !== null) {
      linesInfo.firstIndentationType = currentLine.nameDetails.indentType;
      linesInfo.firstIndentationAmount = currentLine.nameDetails.indentAmount;
    }
  },
  compareIndent: guard()
    //equal
    .when((prevLineIndent, currentLineIndent) => {
      return prevLineIndent === currentLineIndent;
    }, (prevLineIndent, currentLineIndent, linesInfo, currentLine) => {

      // currentLine.sibling.push(linesInfo.prevLineInfo);
      // linesInfo.prevLineInfo.sibling
      // console.log("currentLine.sibling", currentLine.sibling);

      // linesInfo.prevLineInfo.sibling.push()

      if (linesInfo.prevLineInfo.sibling.length === 0) {
        currentLine.sibling.push(linesInfo.prevLineInfo);
        linesInfo.prevLineInfo.sibling = currentLine.sibling;
      }

      //TODO: prev sibling also needs to be updated

      currentLine.parent = linesInfo.prevLineInfo.parent;
    }).when((prevLineIndent, currentLineIndent) => {
      return prevLineIndent < currentLineIndent;
    }, (prevLineIndent, currentLineIndent, linesInfo, currentLine) => {

      //Previous line is a parent of the current line
      //as the current line indent is greater than the previous
      currentLine.parent = linesInfo.prevLineInfo;
      linesInfo.prevLineInfo.children.push(currentLine);
    }).any(() => {
      return;
    }),
  relations: (linesInfo, currentLine) => {
    //Determine the indentation level
    if (linesInfo.prevLineInfo &&
      linesInfo.contentLineCount > 1 &&
      currentLine.structureName.length > 0 &&
      linesInfo.prevLineInfo.structureName.length > 0) {
      //If the same indentation level as previous line,
      //than tag the prev as a sibling to the current line
      //Ignore check for siblings on the first line and blank lines
      singleLineInfoFunctions
        .compareIndent(
          linesInfo.prevLineInfo.nameDetails.indentAmount,
          currentLine.nameDetails.indentAmount, linesInfo, currentLine);

      //TODO: More complicated if there is an outdent because of the
      //need to traverse prior entries


    }
  },
  updatePrevLine: (linesInfo, currentLine) => {
    linesInfo.prevLineInfo = currentLine;
  }
};

_.assign(linesInfo.prototype, {
  setGeneralData: (line, lineSetInfo) => {
    //Update current line data with line set info
    data = {
      line, lineSetInfo
    };

    let lineInfo = {
      length: line.length,
      trimLength: line.trim().length
    };

    //Only set the line count info for empty lines
    if (!linesInfoFunctions.countLines(lineInfo)) return;

    //Execute all other data gathering functions
    //for gathering data for lines
    _.each(_.keys(_.omit(linesInfoFunctions, 'countLines')),
      function(value) {
        linesInfoFunctions[value]();
      });
  },
  setLineData: (currentLine, linesInfo) => {
    //First encounter with content line
    linesInfo.prevLineInfo ||
      singleLineInfoFunctions.setFirstPrev(linesInfo, currentLine);

    // Set the indentation information of the
    // first encounter of a non - empty line
    singleLineInfoFunctions.indentation(linesInfo, currentLine);

    //Determine how current line relates to the previous line
    singleLineInfoFunctions.relations(linesInfo, currentLine);

    //Current line will become the previous line after all
    //the necessary data is gather
    singleLineInfoFunctions.updatePrevLine(linesInfo, currentLine);

  }
});

export default linesInfo;
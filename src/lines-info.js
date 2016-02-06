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
    //Previous line indent is equal to the current line
    .when((prevLineIndent, currentLineIndent) => {
      return prevLineIndent === currentLineIndent;

    }, (prevLineIndent, currentLineIndent, linesInfo, currentLine) => {
      if (linesInfo.prevLineInfo.sibling.length === 0) {
        // currentLine.sibling.push(linesInfo.prevLineInfo);
        // linesInfo.prevLineInfo.sibling = currentLine.sibling;
        // console.log(`currentLine is ${currentLine.structureName} as the sibling for, ${linesInfo.prevLineInfo.structureName}`);

        linesInfo.prevLineInfo.sibling.push(currentLine);
        // console.log("sibling for prev is ", linesInfo.prevLineInfo.sibling);
      }
      currentLine.parent = linesInfo.prevLineInfo.parent;
      if (currentLine.parent !== null) {
        currentLine.parent.children.push(currentLine);
      }

      // console.log(`prior same indent  linesInfo.prevLineInfo.sibling for line ${currentLine.structureName}, prev line sib is,`, linesInfo.prevLineInfo.sibling[0]);

    }).when((prevLineIndent, currentLineIndent) => {
      //Previous line indent is less than current
      return prevLineIndent < currentLineIndent;

    }, (prevLineIndent, currentLineIndent, linesInfo, currentLine) => {
      //Previous line is now known as a parent of the current line
      currentLine.parent = linesInfo.prevLineInfo;
      linesInfo.prevLineInfo.children.push(currentLine);

    }).when((prevLineIndent, currentLineIndent) => {
      return prevLineIndent > currentLineIndent;

    }, (prevLineIndent, currentLineIndent, linesInfo, currentLine) => {
      //Use the previous line and navigate back up the levels until the indent level is the same as the current line
      let prevLine = linesInfo.prevLineInfo;
      // console.log("here prevLine", prevLine);
      //TODO: does not go far enough for searching
      //still need to set the prevLine ref frame

      for (let i = 0; i < linesInfo.contentLineCount; i++) {
        if (prevLine.parent.nameDetails.indentAmount === currentLineIndent) {
          //Same prior level of indent means the prior is
          //a sibling to the current line
          if (prevLine.parent.sibling.length === 0) {
            // console.log("2>>>>>>>>>>> found prior sib from for line ", currentLine.structureName);

            prevLine.parent.sibling.push(currentLine);
            // console.log("prior sib is ", prevLine.parent);
          }
          currentLine.parent = prevLine.parent.parent;

          break;
        } else {
          //Continue the search by going up the parents
          prevLine = prevLine.parent;
        }
      }
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
      line,
      lineSetInfo
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
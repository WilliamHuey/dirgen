'use strict';

import _ from 'lodash';

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
    }
  },
  indentation: (linesInfo, currentLine) => {
    if (linesInfo.firstIndentationType === null && currentLine.nameDetails.indentType !== null) {
      linesInfo.firstIndentationType = currentLine.nameDetails.indentType;
      linesInfo.firstIndentationAmount = currentLine.nameDetails.indentAmount;
    }
  },
  relations: (linesInfo, currentLine) => {
    if (linesInfo.prevLineInfo !== null) {

      //Determine the indentation level
      if (linesInfo.contentLineCount > 1 &&
        currentLine.structureName.length > 0 &&
        linesInfo.prevLineInfo.structureName.length > 0) {
        //If the same indentation level as previous line,
        //than tag the prev as a sibling to the current line
        //Ignore check for siblings on the first line and blank lines
        if (linesInfo.prevLineInfo.nameDetails.indentAmount ===
          currentLine.nameDetails.indentAmount
        ) {
          currentLine.sibling = linesInfo.prevLineInfo;
          // console.log("currentLine.structureName", currentLine.structureName);

          //TODO: Still need to check if current line is a children
          //of a previous parent
        } else if (linesInfo.prevLineInfo.nameDetails.indentAmount <
          currentLine.nameDetails.indentAmount) {
          //Previous line is a parent of the current line
          //as the current line indent is greater than the previous
          currentLine.nameDetails.parent = linesInfo.prevLineInfo;
          linesInfo.prevLineInfo.children.push(currentLine);
          // console.log("linesInfo.prevLineInfo", linesInfo.prevLineInfo);
          console.log("child cond at", currentLine.structureName);
        }

        //TODO: More complicated if there is an outdent because of the
        //need to traverse prior entries


      }
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
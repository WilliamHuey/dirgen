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
  countLines: () => {
    //The actual line number involves counting all lines,
    //but the lines with content may differ
    //However, the count the lines with content on them is more important
    data.lineSetInfo.totalLineCount++;
    if (data.line.length > 0) {
      data.lineSetInfo.contentLineCount++;
    }
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

      //what is the indentation level?

      //If the same indentation level as previous line,
      //than tag the prev as a sibling to the current line
      //Ignore check for siblings on the first line and blank lines
      if (linesInfo.prevLineInfo.nameDetails.indentAmount ===
        currentLine.nameDetails.indentAmount &&
        linesInfo.contentLineCount > 1 &&
        currentLine.structureName.length > 0) {

        currentLine.sibling = linesInfo.prevLineInfo;
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

    //Execute all data gathering functions for gathering data for lines
    _.each(_.keys(linesInfoFunctions), function(value) {
      linesInfoFunctions[value]();
    });
  },
  setLineData: (currentLine, linesInfo) => {
    //First encounter with content line
    linesInfo.prevLineInfo ||
      singleLineInfoFunctions.setFirstPrev(linesInfo, currentLine);

    //Set the indentation information of the
    //first encounter of a non-empty line
    singleLineInfoFunctions.indentation(linesInfo, currentLine);

    //Determine how current line relates to the previous line
    singleLineInfoFunctions.relations(linesInfo, currentLine);

    //Current line will become the previous line after all
    //the necessary data is gather
    singleLineInfoFunctions.updatePrevLine(linesInfo, currentLine);

  }
});

export default linesInfo;
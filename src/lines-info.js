'use strict';

import _ from 'lodash';

let data = {};
let linesInfoFunctions = {
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

let linesInfo = () => {};

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
    if (linesInfo.prevLineInfo === null) {
      linesInfo.prevLineInfo = currentLine;
    }

    //Set the indentation information of the
    //first encounter of a non-empty line
    if (linesInfo.firstIndentationType === null && currentLine.nameDetails.indentType !== null) {
      linesInfo.firstIndentationType = currentLine.nameDetails.indentType;
      linesInfo.firstIndentationAmount = currentLine.nameDetails.indentAmount;
    }
  }
});

export default linesInfo;
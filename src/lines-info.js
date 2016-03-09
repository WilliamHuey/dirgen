'use strict';

//Vendor modules
import _ from 'lodash';

//Source modules
import singleLineInfoFunctions from './singleLine-info';

let data = {},
  linesInfo = () => {};

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
    //but the lines with content matters more so count them differently
    data.lineSetInfo.totalLineCount++;
    if (lineInfo.length > 0 && lineInfo.trimLength > 0) {
      data.lineSetInfo.contentLineCount++;
      processFurther = true;
    }
    return processFurther;
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
      trimLength: line.trim()
        .length
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
    let isFirstLine = false;
    if (linesInfo.prevLineInfo === null) {
      isFirstLine = true;
    }

    //First encounter with content line
    linesInfo.prevLineInfo ||
      singleLineInfoFunctions.setFirstPrev(linesInfo, currentLine);

    // Set the indentation information of the
    // first encounter of a non - empty line
    singleLineInfoFunctions.indentation(linesInfo, currentLine);

    //Determine how current line relates to the previous line
    singleLineInfoFunctions.relations(linesInfo, currentLine, isFirstLine);

    //Current line will become the previous line after all
    //the necessary data is gather
    singleLineInfoFunctions.updatePrevLine(linesInfo, currentLine);

    return currentLine;
  }
});

export
default linesInfo;
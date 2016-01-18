'use strict';

import _ from 'lodash';

let data = {};
let linesInfoFunctions = {
  currentValue: function() {
    data.lineSetInfo.currentValue = data.line;
  },
  trimmedValue: function() {
    data.lineSetInfo.currentTrimmedValue = data.line.trim();
  },
  countLines: function() {
    //The actual line number involves counting all lines,
    //but the lines with content may differ
    //However, the count the lines with content on them is more important
    data.lineSetInfo.totalLineCount++;
    if (data.line.length > 0) {
      data.lineSetInfo.contentLineCount++;
    }
  },
  indentationType: function() {

  },
  indentationAmount: function() {

  }
};

let linesInfo = function() {};

_.assign(linesInfo.prototype, {
  setGeneralData: function(line, lineSetInfo) {
    //Update current line data with line set info
    data = {
      line, lineSetInfo
    };



    //Execute all data gathering functions for gathering data for lines
    _.each(_.keys(linesInfoFunctions), function(value) {
      linesInfoFunctions[value]();
    });
  },
  setLineData: function(currentLine, prevLineInfo) {

    if (prevLineInfo === null) {

    }
  }
});

module.exports = linesInfo;
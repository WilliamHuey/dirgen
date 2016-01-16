'use strict';

let _ = require('lodash');

let linesInfo = function() {};

let excludedFunctions = ['data', 'setGeneralData'];

_.assign(linesInfo.prototype, {
  data: null,
  setGeneralData: function(line, lineSetInfo) {
    //Update current line data with line set info
    this.data = {
      line, lineSetInfo
    };

    //Gather all the data gathering functions on the linesInfo prototype
    _.filter(_.keys(linesInfo.prototype), (n) => {
      // console.log("this lineFunctions", this[n]);
      if (!_.includes(excludedFunctions, n)) {
        this[n]();
      };
    });

  },
  currentValue: function() {
    this.data.lineSetInfo.currentValue = this.data.line;
  },
  trimmedValue: function() {
    this.data.lineSetInfo.currentTrimmedValue = this.data.line.trim();
  },
  countLines: function() {
    //The actual line number involves counting all lines,
    //but the lines with content may differ
    //However, the count the lines with content on them is more important
    this.data.lineSetInfo.actualLineCount++;
    if (this.data.line.length > 0) {
      this.data.lineSetInfo.lineCount++;
    }
  }
});

module.exports = linesInfo;
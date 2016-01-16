'use strict';

let _ = require('lodash');

let linesInfo = function() {};

let excludedFunctions = ['data', 'setData'];

_.assign(linesInfo.prototype, {
  data: null,
  setData: function(line, lineSetInfo) {
    //Gather all the data gathering functions on the linesInfo prototype
    let lineFunctions = _.filter(_.keys(linesInfo.prototype),
      function(n) {
        return !_.includes(excludedFunctions, n);
      });
    // console.log("lineFunctions", lineFunctions);
    this.data = {
      line, lineSetInfo
    };
    _.each(lineFunctions, (n) => {
      this[n]();
    });
    // console.log("data is now", this.data);
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
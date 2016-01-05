import _ from 'lodash';

let linesInfo = function() {};

_.assign(linesInfo.prototype, {
  data: null,
  setData: function(line, lineSetInfo) {
    //Gather all the data gathering functions on the linesInfo prototype
    let lineFunctions = _.filter(_.keys(linesInfo.prototype),
      function(n) {
        return !_.includes(['data', 'setData'], n);
      });
    console.log("lineFunctions", lineFunctions);
    this.data = {
      line, lineSetInfo
    };
    _.each(lineFunctions, (n) => {
      console.log("this is now ", n, this[n]());
    });
    console.log("data is now", this.data);
  },
  trimmedValue: function() {
    this.data.lineSetInfo.trimmedValue = this.data.line.trim();
  },
  countLines: function() {
    //The actual line number involves counting all lines,
    //but the lines with content may differ
    //However, the count the lines with content on them is more important
    this.data.lineSetInfo.actualLineCount++;
    if (this.data.line.length > 0) {
      this.data.lineSetInfo.lineCount++;
    }
  },
  trackLineInfo: function() {

  }
});

export default linesInfo;
import _ from 'lodash';

let linesInfo = function() {};

_.assign(linesInfo.prototype, {
  data: null,
  setData: function(line, lineSetInfo) {
    console.log("line", line);
    this.data = {
      line, lineSetInfo
    };
    // console.log("data is now", this.data);
    this.setInfo();
    this.trimmedValue();
  },
  setInfo: function() {
    console.log("this line", this.data.line);
    //this.trimmedValue();
  },
  trimmedValue: function() {
    // lineSetInfo.trimmedValue = line.trim();
  },
  countLines: function() {
    //The actual line number involves counting all lines,
    //but the lines with content may differ
    //However, the count the lines with content on them is more important
    lineSetInfo.actualLineCount++;
    if (line.length > 0) {
      lineSetInfo.lineCount++;
    }
  }
});

export default linesInfo;
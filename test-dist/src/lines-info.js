'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var linesInfo = function linesInfo() {};

_lodash2['default'].assign(linesInfo.prototype, {
  data: null,
  setData: function setData(line, lineSetInfo) {
    var _this = this;

    //Gather all the data gathering functions on the linesInfo prototype
    var lineFunctions = _lodash2['default'].filter(_lodash2['default'].keys(linesInfo.prototype), function (n) {
      return !_lodash2['default'].includes(['data', 'setData'], n);
    });
    console.log("lineFunctions", lineFunctions);
    this.data = {
      line: line, lineSetInfo: lineSetInfo
    };
    _lodash2['default'].each(lineFunctions, function (n) {
      console.log("this is now ", n, _this[n]());
    });
    console.log("data is now", this.data);
  },
  trimmedValue: function trimmedValue() {
    this.data.lineSetInfo.trimmedValue = this.data.line.trim();
  },
  countLines: function countLines() {
    //The actual line number involves counting all lines,
    //but the lines with content may differ
    //However, the count the lines with content on them is more important
    this.data.lineSetInfo.actualLineCount++;
    if (this.data.line.length > 0) {
      this.data.lineSetInfo.lineCount++;
    }
  },
  trackLineInfo: function trackLineInfo() {}
});

exports['default'] = linesInfo;
module.exports = exports['default'];
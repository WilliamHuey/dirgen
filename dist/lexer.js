'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _detectIndent = require('detect-indent');

var _detectIndent2 = _interopRequireDefault(_detectIndent);

var _strscanner = require('strscanner');

var _strscanner2 = _interopRequireDefault(_strscanner);

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

//Should also detect indentation and well as symbols
function Lexer() {}

Lexer.prototype = {
  lex: function lex(line) {
    console.log("line in lexer is ", line);
  }
};

exports['default'] = Lexer;
module.exports = exports['default'];
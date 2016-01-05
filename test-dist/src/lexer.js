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

var _characterMap = require('./character-map');

var _characterMap2 = _interopRequireDefault(_characterMap);

//Should also detect indentation and well as symbols
function Lexer() {}

Lexer.prototype = {
  lex: function lex(line) {
    // console.log("line in lexer is ", line);
    var scanner = (0, _strscanner2['default'])(line),
        lineTokenStats = {
      totalLength: line.length,
      //charPos and currentCharCode final value
      //will be determined by the last character in the line
      charPos: 0,
      currentCharCode: '',
      structureType: null,
      specialCharacters: {}
    };

    //TODO: Take in option to trim right or not
    //Get indentation information
    var indentInfo = (0, _detectIndent2['default'])(line);
    lineTokenStats.indentAmount = indentInfo.amount;
    lineTokenStats.indentType = indentInfo.type;
    //length of line with the the left space characters
    lineTokenStats.contentLength = lineTokenStats.totalLength - indentInfo.amount;

    //Scan the current line to get stats
    while (!scanner.eof()) {
      //Check and track non-alphabetical characters
      if (!scanner.isAZ()) {
        lineTokenStats.charPos = scanner.pos();
        lineTokenStats.currentCharCode = line.charCodeAt(lineTokenStats.charPos);
        // console.log("charPos at init ", lineTokenStats.charPos);
        // console.log('currentCharCode ', lineTokenStats.currentCharCode);

        //Log all special character information
        var characterInfo = lineTokenStats.specialCharacters[lineTokenStats.currentCharCode];
        if (typeof characterInfo === 'undefined') {
          // console.log("lineTokenStats.charPos", lineTokenStats.charPos);
          lineTokenStats.specialCharacters[lineTokenStats.currentCharCode] = {
            count: 1,
            position: [lineTokenStats.charPos]
          };
          //Count the number of special characters
          lineTokenStats.specialCharactersTypeCount = 1;
        } else {
          //Update the character prior info
          characterInfo.count += 1;
          var characterPosition = characterInfo.position;
          characterPosition.push(lineTokenStats.charPos);
          characterInfo.position = characterPosition;
          lineTokenStats.specialCharactersTypeCount += 1;
          // console.log("characterInfo.position", characterInfo.position);
          // console.log("characterInfo", JSON.stringify(characterInfo));
          // console.log("first lineTokenStats", JSON.stringify(lineTokenStats));
        }
      }
      scanner.nextChar();
    }
    // console.log("lineTokenStats", JSON.stringify(lineTokenStats));
    return lineTokenStats;
  }
};

exports['default'] = Lexer;
module.exports = exports['default'];
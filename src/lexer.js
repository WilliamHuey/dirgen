'use strict';

//Vendor modules
import detectIndent from 'detect-indent';
import strscan from 'strscanner';
import _ from 'lodash';

//Vendor modules
import characterMap from './character-map';

//Should also detect indentation and well as symbols
let lexer = () => {};

_.assign(lexer.prototype, {
  lex: (line) => {
    // console.log("line in lexer is ", line);
    let scanner = strscan(line),
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
    let indentInfo = detectIndent(line);
    lineTokenStats.indentAmount = indentInfo.amount;
    lineTokenStats.indentType = indentInfo.type;
    //length of line with the the left space characters
    lineTokenStats.contentLength = lineTokenStats.totalLength -
      indentInfo.amount;
    lineTokenStats.currentTrimmedValue = line.trim();

    //Scan the current line to get stats
    while (!scanner.eof()) {
      //Check and track non-alphabetical characters
      if (!scanner.isAZ()) {
        lineTokenStats.charPos = scanner.pos();
        lineTokenStats.currentCharCode = line.charCodeAt(lineTokenStats.charPos);

        //Log all special character information
        let characterInfo = lineTokenStats
          .specialCharacters[lineTokenStats.currentCharCode];
        if (typeof characterInfo === 'undefined') {
          lineTokenStats
            .specialCharacters[lineTokenStats.currentCharCode] = {
              count: 1,
              position: [lineTokenStats.charPos]
            };
          //Count the number of special characters
          lineTokenStats.specialCharactersTypeCount = 1;
        } else {
          //Update the character prior info
          characterInfo.count += 1;
          let characterPosition = characterInfo.position;
          characterPosition.push(lineTokenStats.charPos);
          characterInfo.position = characterPosition;
          lineTokenStats.specialCharactersTypeCount += 1;
        }
      }
      scanner.nextChar();
    }
    return lineTokenStats;
  }

});

export default lexer;
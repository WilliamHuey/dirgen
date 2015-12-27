import detectIndent from 'detect-indent';
import strscan from 'strscanner';
import PrettyError from 'pretty-error';
import characterMap from './character-map.js';

//Should also detect indentation and well as symbols
function Lexer() {}

Lexer.prototype = {
  lex: line => {
    console.log("line in lexer is ", line);
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

    //Scan the current line to get stats
    while (!scanner.eof()) {
      //Check and track non-alphabetical characters
      if (!scanner.isAZ()) {
        lineTokenStats.charPos = scanner.pos();
        lineTokenStats.currentCharCode = line.charCodeAt(lineTokenStats.charPos);
        // console.log("charPos at init ", lineTokenStats.charPos);
        // console.log('currentCharCode ', lineTokenStats.currentCharCode);

        //Log all special character information
        let characterInfo = lineTokenStats
          .specialCharacters[lineTokenStats.currentCharCode];
        if (typeof characterInfo === 'undefined') {
          // console.log("lineTokenStats.charPos", lineTokenStats.charPos);
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
          // console.log("characterInfo.position", characterInfo.position);
          // console.log("characterInfo", JSON.stringify(characterInfo));
          // console.log("first lineTokenStats", JSON.stringify(lineTokenStats));
        }
      }
      scanner.nextChar();
    }
    // console.log("lineTokenStats", JSON.stringify(lineTokenStats));
  }
};

export default Lexer;
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
        length: line.length,
        charPos: 0,
        currentCharCode: '',
        structureType: null,
        specialCharacters: {}
      };

    //Scan the current line to get stats
    while (!scanner.eof()) {
      //Check and track non-alphabetical characters
      if (!scanner.isAZ()) {
        lineTokenStats.charPos = scanner.pos();
        lineTokenStats.currentCharCode = line.charCodeAt(lineTokenStats.charPos);
        console.log("charPos at init ", lineTokenStats.charPos);
        console.log('currentCharCode ', lineTokenStats.currentCharCode);

        //Log all special character information
        let characterInfo = lineTokenStats
          .specialCharacters[lineTokenStats.currentCharCode];
        if (typeof characterInfo === 'undefined') {
          console.log("lineTokenStats.charPos", lineTokenStats.charPos);
          characterInfo = {
            count: 1,
            position: [lineTokenStats.charPos]
          };
        } else {
          //Update the character prior info
          characterInfo.count += 1;
          let characterPosition = characterInfo.position;
          characterPosition.push(lineTokenStats.charPos);
          characterInfo.position = characterPosition;
          console.log("characterInfo.position", characterInfo.position);
        }
      }
      scanner.nextChar();
    }

    console.log("lineTokenStats", JSON.stringify(lineTokenStats));
  }
};

export default Lexer;
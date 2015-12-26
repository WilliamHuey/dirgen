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
        specialCharacters: null
      };

    //Scan the current line to get stats
    while (!scanner.eof()) {
      //Check and track non-alphabetical characters
      if (!scanner.isAZ()) {
        lineTokenStats.charPos = scanner.pos();
        lineTokenStats.currentCharCode = line.charCodeAt(lineTokenStats.charPos);
        console.log("charPos at init ", lineTokenStats.charPos);
        console.log('currentCharCode ', lineTokenStats.currentCharCode);

        //Logging

        /*
        specialCharacters ({
          number_char_code: {count: aa, positions: []},
          number_char_code: {count: aa, positions: []}

      })
        */
      }
      scanner.nextChar();
    }
  }
};

export default Lexer;
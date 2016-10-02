//Vendor modules
import detectIndent from 'detect-indent';
import strscan from 'strscanner';

//Should also detect indentation and well as symbols
function lexer() {}

export default Object.assign(lexer.prototype, {
  lex: (line) => {
    const scanner = strscan(line),
      lineTokenStats = {
        totalLength: line.length,

        //charPos and currentCharCode final value
        //will be determined by the last character in the line
        charPos: 0,
        currentCharCode: '',
        structureType: null,
        specialCharacters: {}
      };

    //Get indentation information
    const indentInfo = detectIndent(line);
    lineTokenStats.indentAmount = indentInfo.amount;
    lineTokenStats.indentType = indentInfo.type;

    //length of line with the the left space characters
    lineTokenStats.contentLength = lineTokenStats.totalLength -
      indentInfo.amount;
    lineTokenStats.currentTrimmedValue = line.trim();

    //Recomputed indent amount and trimmed length
    //not equally to the original means a mixture of spaces and tabs
    if (lineTokenStats.indentAmount + lineTokenStats.contentLength !==
       (indentInfo.amount + lineTokenStats.currentTrimmedValue.length)) {
         lineTokenStats.mixedTabsSpaces = true;
    }

    //Scan the current line to get stats
    while (!scanner.eof()) {

      //Check and track non-alphabetical  and non-numeric characters
      if (!(scanner.isAZ() || scanner.is09())) {
        lineTokenStats.charPos = scanner.pos();
        lineTokenStats.currentCharCode = line.charCodeAt(lineTokenStats.charPos);

        //Log all special character information
        const characterInfo = lineTokenStats
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
          const characterPosition = characterInfo.position;
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


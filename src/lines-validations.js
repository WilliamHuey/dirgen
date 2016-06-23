'use strict';

//Vendor modules
import sanitize from 'sanitize-filename';
import recursive from 'tail-call/core';

//Source modules
import structureMarker from './character-code';

const slashChar = String.fromCharCode(structureMarker.folder);
const tailCall = recursive.recur;
let validator = () => {};

Object.assign(validator.prototype, {
  cleanFileName: (specialCharactersTypeCount, lineNum, content) => {
    let cleanedName = sanitize(content);

    if (cleanedName !== content &&
      content.length < 255) {

      //One slash in front of line implied a folder
      //but any invalid character persist after the first slash
      //will cause the line to be invalid
      //OR
      //Other specials characters were found
      if ((content.indexOf(slashChar) !== content.lastIndexOf(slashChar)) ||
        (specialCharactersTypeCount &&
          specialCharactersTypeCount > 0)) {
        return {
          type: 'warning',
          line: {
            number: lineNum,
            message: `Line #${lineNum}:
              '${content.trim()}', has illegal characters
              which has been replaced, resulting in '${cleanedName}'.`
          },
          output: cleanedName
        };
      } else {

        return {
          type: 'valid'
        };
      }
    } else {

      return {
        type: 'valid'
      };
    }
  },
  sameIndentType: (lineNum, content,
    firstIndentType, currentIndentType) => {

    //Protect against null, which signifies no indent level
    if (currentIndentType !== null &&
      currentIndentType !== firstIndentType) {

      return {
        type: 'error',
        line: {
          number: lineNum,
          message: `Line #${lineNum}:
             '${content.trim()}',
             has indent type of '${currentIndentType}'
             which is inconsistent with the first defined outdent type of '${firstIndentType}'. Nothing was generated.`
        }
      };
    } else {

      return {
        type: 'valid'
      };
    }
  },
  presenceFirstLine: (firstLine) => {

    if (firstLine !== null) {

      return {
        type: 'valid',
        output: true
      };
    } else {

      return {
        type: 'error',
        line: {
          number: 0,
          message: 'Supplied template file has no content to generate.'
        }
      };
    }
  },
  properIndentLevel: (lineNum, content, firstIndentAmt,
    prevLineIndentAmt, currentIndentAmt,
    firstIndentType, currentIndentType, indentType,
    prevLineParent, prevLineFirstLine) => {
    if (indentType === 'outdent' &&
      prevLineParent === null &&
      prevLineFirstLine) {

      return {
        type: 'error',
        line: {
          number: lineNum,
          message: `Line #${lineNum}:
           '${content.trim()}' , prior line was the first line
           which was further indented than the current line.
           Ambigious results might occur. Nothing was generated.`
        }
      };
    } else if (indentType === 'outdent' &&
      !(currentIndentAmt % firstIndentAmt === 0) &&
      !(currentIndentAmt >= firstIndentAmt)) {

      return {
        type: 'error',
        line: {
          number: lineNum,
          message: `Line #${lineNum}:
              '${content.trim()}', has indent amount of ${currentIndentAmt} ${currentIndentType}(s) which is inconsistent with the
              first defined outdent of ${firstIndentAmt} ${firstIndentType}(s). Nothing was generated.`
        }
      };
    } else if (indentType !== 'outdent' &&
      !(Math.abs(currentIndentAmt - prevLineIndentAmt) ===
        firstIndentAmt)) {
      //Scaling indent factor and firstIndent is the same

      return {
        type: 'error',
        line: {
          number: lineNum,
          message: `Line #${lineNum}:
            '${content.trim()}', has an indent
            amount of ${Math.abs(currentIndentAmt - prevLineIndentAmt)} ${currentIndentType}(s) relative to parent folder,
            which is different from the
            first defined indent amount of ${firstIndentAmt} ${firstIndentType}(s). Nothing was generated.`
        }
      };
    } else {

      return {
        type: 'valid'
      };
    }
  },
  charCountUnder255: (count, lineNum, content, inferType) => {
    if (count > 255) {

      return {
        type: 'error',
        line: {
          number: lineNum,
          message: `Line #${lineNum}: '${content}', has a character
            count of ${count}, which exceeds 255. ${inferType.charAt(0).toUpperCase() +
            inferType.slice(1)}. Nothing was generated.`
        }
      };
    } else {
      return {
        type: 'valid'
      };
    }
  },
  repeatedLines: (linesInfo, structureCreation, line) => {
    const lineNum = line.nameDetails.line;

    //Additional note for siblings that are later repeats
    let repeatedFirstSiblingLine = '';
    if ((line.parent && !line.earliestSiblingLine)) {

      let repeatedSiblings = line.parent.repeatedChildren;

      repeatedFirstSiblingLine = `First appearance of sibling is on line #${repeatedSiblings[line.structureName]}.`;
    } else if (line.parent === null) {

      //For top level line repeats
      let repeatedSiblings = linesInfo.topLevelIndex[line.structureName];

      repeatedFirstSiblingLine = `First appearance of sibling is on line #${repeatedSiblings}.`;
    }

    structureCreation.repeats.push({
      name: line.structureName,
      line: line.nameDetails.line
    });

    if (line.inferType === 'folder') {
      let childrenNote = '';

      //Has children for extra note
      if (line.children.length > 0) {
        childrenNote = 'along with its child files and/or folders';
      }

      return {
        type: 'warning',
        line: {
          number: lineNum,
          message: `Line #${lineNum}: '${line.structureName}',
            of folder type is a repeated line
            and was not generated ${childrenNote}. ${repeatedFirstSiblingLine}`
        }
      };
    } else {
      return {
        type: 'warning',
        line: {
          number: lineNum,
          message: `Line #${lineNum}: '${line.structureName}',
           of file type is a repeated line
           and was
           not generated. ${repeatedFirstSiblingLine}`
        }
      };
    }
  },
  sameLineMixedTabsAndSpaces: (mixedTabsSpaces, lineNum, structureName) => {
    if (mixedTabsSpaces) {
      return {
        type: 'error',
        line: {
          number: lineNum,
          message: `Line #${lineNum}: '${structureName}',
           has mixed tabs and spaces on the left of first non-blank character. Nothing was generated.`
        }
      };
    } else {
      return {
        type: 'valid'
      };
    }
  }
});

export default validator;

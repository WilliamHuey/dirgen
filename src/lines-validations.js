'use strict';

//Vendor modules
import sanitize from 'sanitize-filename';
import recursive from 'tail-call/core';

//Source modules
import util from './utilities';
import structureMarker from './character-code';

const slashChar = String.fromCharCode(structureMarker.folder);
const tailCall = recursive.recur;
let validator = () => {};

Object.assign(validator.prototype, {
  cleanFileName: (specialCharactersTypeCount, lineNum, content) => {
    let cleanedName = sanitize(content);

    let isUnCleanName = cleanedName !== content;

    if (isUnCleanName && content.length < 255) {

      //One slash in front of line implied a folder
      //but any invalid character persist after the first slash
      //will cause the line to be invalid
      //OR
      //Other specials characters were found

      //Excessive slash characters case
      //specialCharactersTypeCount only really refers to the slash characters for now
      const hasSlashChar = content.includes(slashChar);
      const slashNotAsFirstChar = content.lastIndexOf(slashChar) > 1;
      const moreThanOneSpecialChar = specialCharactersTypeCount > 1;
      const slashAsFirstChar = content.indexOf(slashChar) === 0;

      const excessiveSlashes = hasSlashChar &&
        slashNotAsFirstChar && moreThanOneSpecialChar;

      const hasOnlyRemovedFirstSlash = content.slice(1) === cleanedName;

      if (excessiveSlashes || (!excessiveSlashes && isUnCleanName &&
         !hasOnlyRemovedFirstSlash)) {

        let diffCountInSanitized = content.length - cleanedName.length;

        //Do not count a folder marker slash as an invalid character
        if (slashAsFirstChar) {
          diffCountInSanitized -= 1;
        }

        const pluralizedWord = util.pluralize('character', diffCountInSanitized);
        const needArticleWord = pluralizedWord !== 'character' ? '' : 'an';

        return {
          type: 'warning',
          line: {
            number: lineNum,
            message: `Line #${lineNum}:
              '${content}', has ${needArticleWord} illegal ${pluralizedWord}
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
  properIndentLevel: (firstLineIndentAmt, lineNum, content, firstIndentAmt,
    prevLineIndentAmt, currentIndentAmt,
    firstIndentType, currentIndentType, indentType,
    prevLineParent, prevLineFirstLine) => {

      if (currentIndentAmt < firstLineIndentAmt) {

        let formatFirstIndentType = firstIndentType === null ? '' : firstIndentType;

        return {
          type: 'error',
          line: {
            number: lineNum,
            message: `Line #${lineNum}:
              '${content.trim()}', has an indent
              amount of ${currentIndentAmt} ${util.pluralize(formatFirstIndentType, currentIndentAmt)},
              which is less than the
              first line indent amount of ${firstLineIndentAmt} ${util.pluralize(firstIndentType, firstLineIndentAmt)}. Nothing was generated.`
          }
        };

      } else if (indentType === 'outdent' &&
      !(currentIndentAmt % firstIndentAmt === 0) &&
      !(currentIndentAmt >= firstIndentAmt)) {

      let formatCurrentIndentType = currentIndentType === null ? '' : currentIndentType;

      return {
        type: 'error',
        line: {
          number: lineNum,
          message: `Line #${lineNum}:
              '${content.trim()}', has indent amount of ${currentIndentAmt} ${util.pluralize(formatCurrentIndentType, currentIndentAmt)} which is inconsistent with the
              first defined outdent of ${util.pluralize(firstIndentType, firstIndentAmt)}. Nothing was generated.`
        }
      };
    } else if (indentType !== 'outdent' &&
      !(Math.abs(currentIndentAmt - prevLineIndentAmt) ===
        firstIndentAmt)) {

      let currentLineIndent = Math.abs(currentIndentAmt - prevLineIndentAmt);

      //Scaling indent factor and firstIndent is the same
      return {
        type: 'error',
        line: {
          number: lineNum,
          message: `Line #${lineNum}:
            '${content.trim()}', has an indent
            amount of ${util.pluralize(currentIndentType, currentLineIndent)} relative to parent folder,
            which is different from the
            first defined indent amount of ${util.pluralize(firstIndentType, firstIndentAmt)}. Nothing was generated.`
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

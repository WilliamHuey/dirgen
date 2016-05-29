'use strict';

//Vendor modules
import sanitize from 'sanitize-filename';
import recursive from 'tail-call/core';

//Source modules
import message from './validations-messages';
import structureMarker from './character-code';

const tailCall = recursive.recur;
let validator = () => {};

Object.assign(validator.prototype, {
  topLevelRepeatedLines: (firstLine, lastLineNum) => {

    let levelRepeats = {};
    let currentLine = firstLine;
    let nextLine = firstLine.sibling;
    let searchLine = firstLine.nameDetails.line;

    console.log("first searchLine", searchLine);
    console.log("lastLineNum", lastLineNum);

    for (; searchLine <= lastLineNum;) {
      // console.log("nextLine", nextLine);


      let lineName = currentLine.structureName;

      console.log("lineName", lineName);

      if (levelRepeats.hasOwnProperty(lineName)) {
        console.log("old key", lineName);
        console.log("currentLine", currentLine);
        // console.log("levelRepeats.get(lineName).", levelRepeats.get(lineName));
        let lineNameRepeats = levelRepeats[lineName].concat();

        lineNameRepeats.push(currentLine.nameDetails.line);

        console.log("lineNameRepeats", lineNameRepeats);

        levelRepeats[lineName] = lineNameRepeats;

        console.log("now levelRepeats", levelRepeats);

        // console.log("eeeeeeee currentLine", currentLine);
        // console.log(")))))))eeee");
        // console.log("eeee searchLine later", searchLine);
        // console.log("eeee<<<<");
        // console.log("eeeenextLine", nextLine);
      } else {
        console.log("new key lineName", lineName);
        console.log("currentLine.nameDetails.line", currentLine.nameDetails.line);

        levelRepeats[lineName] = [currentLine.nameDetails.line];

        console.log("levelRepeats", levelRepeats);


        // console.log("(searchLine + 1)", (searchLine + 1));
        // console.log("lastLineNum", lastLineNum);

        if ((searchLine + 1) > lastLineNum) {
          //End immediately once no more siblings are found
          console.log("searchLine", searchLine);
          console.log("lastLineNum", lastLineNum);
          console.log("exit immediately");
          searchLine = lastLineNum;
          return levelRepeats;
        }
      }
      // console.log("nextLine[0].nameDetails", nextLine[0].nameDetails);

      currentLine = nextLine[0];
      searchLine = currentLine.nameDetails.line;

      nextLine = currentLine.sibling;

      console.log("currentLine", currentLine);
      console.log(")))))))");
      console.log("searchLine later", searchLine);
      console.log("<<<<");
      console.log("nextLine", nextLine);
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");


    }
    //

    console.log("---------------------------------------just out levelRepeats", levelRepeats);




    // console.log("levelRepeats", levelRepeats);

  },
  repeatedLines: (lineNum, children) => {
    let childStructureNames = new Map();
    let structureName = null;

    children.forEach((val) => {

      //Child structure name
      structureName = val.structureName;
      let childLineNum = val.nameDetails.line;

      //Push to the array of collected repeats
      if (childStructureNames.has(val.structureName)) {
        //Make a copy as to not mutate the original reference of repeats
        let repeatedArr = childStructureNames.get(val.structureName).concat();
        childStructureNames.set(repeatedArr.push(childLineNum));
        let repeatedEntries = childStructureNames.get(val.structureName);
        //Send the message after saving the repeated value
        message.warn(`Line #${repeatedEntries[0]}: '${structureName}', has repeated entries on
        line(s): ${repeatedEntries.slice(1)}.
        The last repeated value line overwritten all previous entries.`);
      } else {
        //Initialize the array for the first child found
        childStructureNames.set(val.structureName, [childLineNum]);
      }
    });

  },
  cleanFileName: (lineNum, content) => {
    let cleanedName = sanitize(content);
    if (cleanedName !== content &&
      content.length < 255) {

      //One slash in front of line implied a folder
      //but any invalid character persist after the first slash
      //will cause the line to be invalid
      if (!(content.charCodeAt(0) === structureMarker.folder &&
          content.slice(1) === cleanedName)) {

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
      console.log("lineNum", lineNum);
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
      // console.log("has content");
      // callback.apply(null, callbackArgs);
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
  properIndentLevel: (lineNum, content, firstIndentAmt, prevLineIndentAmt, currentIndentAmt,
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
    } else if (indentType !== 'outdent' && !(Math.abs(currentIndentAmt - prevLineIndentAmt) ===
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
  }
});

export default validator;
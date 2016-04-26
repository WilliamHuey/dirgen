'use strict';

//Vendor modules
import guard from 'guard-js';
import _ from 'lodash';

//Source modules
import Validations from './lines-validations';
import structureMarker from './character-code';

const validator = new Validations();

let singleLineInfoFunctions = {
  setFirstPrev: (linesInfo, currentLine) => {
    if (linesInfo.prevLineInfo === null) {
      linesInfo.prevLineInfo = currentLine;

      //Also set the first actual content line encounter
      linesInfo.firstLine = currentLine;
    }
  },
  setStructureTypeByChar: (currentLine) => {

    //If the line has a slash in front than it is a folder,
    //regardless of whether or not it has periods in its name

    if (_.hasIn(currentLine.nameDetails.specialCharacters, structureMarker.folder)) {
      currentLine.inferType = 'folder';
    } else if (_.hasIn(currentLine.nameDetails.specialCharacters, structureMarker.file)) {

      //if a one or more periods in the name than it is assumed to be a file
      currentLine.inferType = 'file';
    }
  },
  countLine: (linesInfo, currentLine) => {
    currentLine.nameDetails.line = linesInfo.totalLineCount;
  },
  indentation: (linesInfo, currentLine) => {
    if (linesInfo.firstIndentationType === null && currentLine.nameDetails.indentType !== null) {
      linesInfo.firstIndentationType = currentLine.nameDetails.indentType;
      linesInfo.firstIndentationAmount = currentLine.nameDetails.indentAmount;
    }
  },
  compareIndent: guard()
    .when((prevLineIndent, currentLineIndent, linesInfo, currentLine, isFirstLine) => {
      return isFirstLine;
    }, (prevLineIndent, currentLineIndent, linesInfo, currentLine, isFirstLine) => {

      //Assume is file type unless new information comes up
      currentLine.inferType = 'file';

      //Need to know the first content line indent amount to note the sibling check
      //read marker
      linesInfo.firstContentLineIndentAmount = currentLine.nameDetails.indentAmount;

      //See if the indentation needs to be increased
      //for a consistent relative spacing per line
      if (linesInfo.firstContentLineIndentAmount > 0) {
        linesInfo.requireIndentFactor = true;
      }
    })

  //Previous line indent is equal to the current line
  .when((prevLineIndent, currentLineIndent) => {
    return prevLineIndent === currentLineIndent;

  }, (prevLineIndent, currentLineIndent, linesInfo, currentLine) => {
    if (linesInfo.prevLineInfo.sibling.length === 0) {

      linesInfo.prevLineInfo.sibling.push(currentLine);
    }
    currentLine.parent = linesInfo.prevLineInfo.parent;
    if (currentLine.parent !== null) {
      currentLine.parent.children.push(currentLine);
    }

    //Set previous line and current line
    //as a file type if uncertain of file type
    //Assume that they are files until new
    //information comes out
    if (_.isUndefined(linesInfo.prevLineInfo.inferType)) {
      linesInfo.prevLineInfo.inferType = 'file';
    }

    if (_.isUndefined(currentLine.inferType)) {
      currentLine.inferType = 'file';
    }

  })
    .when((prevLineIndent, currentLineIndent) => {
      //Previous line indent is less than current
      return prevLineIndent < currentLineIndent;

    }, (prevLineIndent, currentLineIndent, linesInfo, currentLine) => {

      //Validate the indent level of child relative to parent
      validator.properIndentLevel(linesInfo.totalLineCount, currentLine.structureName,
         linesInfo.firstIndentationAmount,
         prevLineIndent,
       currentLineIndent,
       linesInfo.firstIndentationType,
       currentLine.nameDetails.indentType, 'indent');

      //Previous line is now known as a parent of the current line
      currentLine.parent = linesInfo.prevLineInfo;
      linesInfo.prevLineInfo.children.push(currentLine);

      currentLine.parent.inferType = 'folder';

      //Assume currentline to be a file, unless proven later on
      if (_.isUndefined(currentLine.inferType)) {
        currentLine.inferType = 'file';
      }

    })
    .when((prevLineIndent, currentLineIndent) => {
      return prevLineIndent > currentLineIndent;

    }, (prevLineIndent, currentLineIndent, linesInfo, currentLine) => {

      //Use the previous line and navigate back up the levels until the indent level is the same as the current line
      let prevLine = linesInfo.prevLineInfo;

      for (let i = 0; i < linesInfo.contentLineCount; i++) {

        //Validate the indent level of child relative to parent
        validator.properIndentLevel(linesInfo.totalLineCount, currentLine.structureName,
           linesInfo.firstIndentationAmount,
           prevLine.nameDetails.indentAmount,
         currentLineIndent,
         linesInfo.firstIndentationType,
         currentLine.nameDetails.indentType, 'outdent');

        if (prevLine.parent.nameDetails.indentAmount === currentLineIndent) {

          //Same prior level of indent means the prior is
          //a sibling to the current line
          if (prevLine.parent.sibling.length === 0) {
            prevLine.parent.sibling.push(currentLine);

            //Check against last line having less indent than previous
            if (!_.isNull(prevLine.parent.parent)) {
              prevLine.parent.parent.children.push(currentLine);
            }
          }

          //Check against last line having less indent than previous
          if (!_.isNull(prevLine.parent.parent)) {
            currentLine.parent = prevLine.parent.parent;
          }

          //Assume currentline to be a file, unless proven later on
          if (_.isUndefined(currentLine.inferType)) {
            currentLine.inferType = 'file';
          }

          break;
        } else {

          //Continue the search by going up the parents
          prevLine = prevLine.parent;
        }
      }
    })
    .any(() => {
      return;
    }),
  relations: (linesInfo, currentLine, isFirstLine) => {

    //Determine the indentation level
    if (linesInfo.prevLineInfo &&
      linesInfo.contentLineCount > 1 &&
      currentLine.structureName.length > 0 &&
      linesInfo.prevLineInfo.structureName.length > 0) {

      //Check on the characters in the content line to make immediate
      //determination of the structure type
      //This will take care of the relationship
      //that is not determined by indentation
      singleLineInfoFunctions.setStructureTypeByChar(currentLine);

      //Check indent level of current line and
      //ignore check for siblings on the first line and blank lines
      singleLineInfoFunctions
        .compareIndent(
          linesInfo.prevLineInfo.nameDetails.indentAmount,
          currentLine.nameDetails.indentAmount, linesInfo, currentLine);

    } else if (linesInfo.contentLineCount === 1 &&
      currentLine.structureName.length > 0 && isFirstLine) {

      //First content line
      singleLineInfoFunctions
        .compareIndent(
          linesInfo.prevLineInfo.nameDetails.indentAmount,
          currentLine.nameDetails.indentAmount, linesInfo, currentLine, isFirstLine);
    }
  },
  updatePrevLine: (linesInfo, currentLine) => {
    linesInfo.prevLineInfo = currentLine;
  }
};

export
default singleLineInfoFunctions;
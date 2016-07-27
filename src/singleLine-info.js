'use strict';

//Vendor modules
import guard from 'guard-js';

//Source modules
import Validations from './lines-validations';
import structureMarker from './character-code';
import logValidations from './log-validations';

const validator = new Validations();

let topLineNonRepeats = new Map();

let logTopLevel = (linesInfo, currentLine, isFirstLine) => {

  //Actual first line will encounter a null firstLine
  //because nothing was set yet
  //Indent amount of the first top level will equate to its top level siblings
  //Explicit detailing of top line will also suffice
  if (linesInfo.firstLine === null ||
    linesInfo.firstLine.nameDetails.indentAmount === currentLine.nameDetails.indentAmount || isFirstLine) {
    currentLine.isTopLine = true;
    currentLine.repeatedChildren = {};
    linesInfo.topLevel.push(currentLine);

    //Verify top level lines are not repeated
    if (!topLineNonRepeats.get(currentLine.structureName)) {
      //Log the non-repeat lines
      topLineNonRepeats.set(currentLine.structureName, currentLine);
    } else {
      currentLine.repeatedLine = true;
    }
  }
};

let logChildrenLevel = (linesInfo, currentLine, firstChild) => {

  if (firstChild) {

    //The first occurrence of child structure will need
    //create an object on parent to log repeats on current level
    if (typeof currentLine.parent.repeatedChildren !== 'undefined') {
      let repeatedChildren = currentLine.parent.repeatedChildren;
      repeatedChildren[currentLine.structureName] = currentLine.nameDetails.line;
    } else {

      //First child of any folder will create empty object if it does not
      //exist to track any possible children for the current line
      let repeatedChildren = currentLine.parent.repeatedChildren = {};
      repeatedChildren[currentLine.structureName] = currentLine.nameDetails.line;

      //May or might not have siblings, prepare for the case
      //where the line do have siblings further down the lines
      currentLine.earliestSiblingLine = true;
    }

  } else if (!currentLine.isTopLine && currentLine.parent !== null) {

    //Not the first child of siblings lines
    if (currentLine.parent.repeatedChildren
      [currentLine.structureName]) {

      //Repeated appearance of the line in a parent
      currentLine.childRepeatedLine = true;
    } else {

      //Log the first appearance of the child structure
      currentLine.parent.repeatedChildren[currentLine.structureName] = currentLine.nameDetails.line;
    }
  }
};

let singleLineInfoFunctions = {
  setFirstPrev: (linesInfo, currentLine) => {
    if (linesInfo.prevLineInfo === null) {
      currentLine.isFirstLine = true;

      //Record for all the top level lines to assist in a quicker generation
      linesInfo.prevLineInfo = currentLine;
      currentLine.isTopLine = true;

      //True signifies that it is the first line
      logTopLevel(linesInfo, currentLine, true);

      //Also set the first actual content line encounter
      linesInfo.firstLine = currentLine;
    }
  },
  setStructureTypeByChar: (currentLine) => {

    //If the line has a slash in front than it is a folder,
    //regardless of whether or not it has periods in its name
    if (currentLine.nameDetails.specialCharacters
      .hasOwnProperty(structureMarker.folder)) {
      currentLine.inferType = 'folder';
    } else if (currentLine.nameDetails.specialCharacters
      .hasOwnProperty(structureMarker.file)) {

      //if a one or more periods in the name than it is assumed to be a file
      currentLine.inferType = 'file';
    }
  },
  countLine: (linesInfo, currentLine) => {
    currentLine.nameDetails.line = linesInfo.totalLineCount;
  },
  indentation: (linesInfo, currentLine) => {
    if (linesInfo.firstIndentationType === null &&
      currentLine.nameDetails.indentType !== null) {
      linesInfo.firstIndentationType = currentLine.nameDetails.indentType;
      linesInfo.firstIndentationAmount = currentLine.nameDetails.indentAmount;
    }
  },
  compareIndent: guard()
    .when((prevLineIndent, currentLineIndent, linesInfo,
      currentLine, isFirstLine) => {
      return isFirstLine;
    }, (prevLineIndent, currentLineIndent, linesInfo,
      currentLine, isFirstLine) => {

      console.log("on the first line");

      //Assume file type unless the inferType is already set
      if (typeof currentLine.inferType === 'undefined' ||
        currentLine.inferType === null) {
        currentLine.inferType = 'file';
      }

      //Need to know the first content line indent amount
      //to note the sibling check read marker
      linesInfo.firstContentLineIndentAmount = currentLine.nameDetails
        .indentAmount;

      //See if the indentation needs to be increased
      //for a consistent relative spacing per line
      if (linesInfo.firstContentLineIndentAmount > 0) {
        console.log("require indent factor");
        linesInfo.requireIndentFactor = true;
      }
    })

  //Previous line indent is equal to the current line
    .when((prevLineIndent, currentLineIndent) => {
      return prevLineIndent === currentLineIndent;

    }, (prevLineIndent, currentLineIndent, linesInfo, currentLine) => {

      //Line is the sibling of top level sibling
      //Obvious check case, but need further checks below
      logTopLevel(linesInfo, currentLine);

      if (linesInfo.prevLineInfo.sibling.length === 0) {

        linesInfo.prevLineInfo.sibling.push(currentLine);
      }
      currentLine.parent = linesInfo.prevLineInfo.parent;
      if (currentLine.parent !== null) {
        currentLine.parent.children.push(currentLine);
      }

      //Equal indent for current line
      logChildrenLevel(linesInfo, currentLine);

      //Set previous line and current line
      //as a file type if uncertain of file type
      //Assume that they are files until new
      //information comes out
      if (typeof linesInfo.prevLineInfo.inferType === 'undefined') {
        linesInfo.prevLineInfo.inferType = 'file';
      }

      if (typeof currentLine.inferType === 'undefined') {
        currentLine.inferType = 'file';
      }

    })
    .when((prevLineIndent, currentLineIndent) => {

      //Previous line indent is less than current
      return prevLineIndent < currentLineIndent;
    }, (prevLineIndent, currentLineIndent, linesInfo,
      currentLine, isFirstLine, validationResults) => {

      //Line is the sibling of top level sibling
      //Obvious check case, but need further checks below
      logTopLevel(linesInfo, currentLine);

      //Validate the indent level of child relative to parent
      logValidations(
        validator.properIndentLevel(linesInfo.firstLine.nameDetails.indentAmount, linesInfo.totalLineCount,
          currentLine.structureName,
          linesInfo.firstIndentationAmount,
          prevLineIndent,
          currentLineIndent,
          linesInfo.firstIndentationType,
          currentLine.nameDetails.indentType, 'indent'),
        validationResults);

      //Previous line is now known as a parent of the current line
      currentLine.parent = linesInfo.prevLineInfo;
      linesInfo.prevLineInfo.children.push(currentLine);

      //Pass in true to signify that this line
      //is the first child of its parent
      logChildrenLevel(linesInfo, currentLine, true);

      currentLine.parent.inferType = 'folder';

      //Assume currentline to be a file, unless proven later on
      if (typeof currentLine.inferType === 'undefined') {
        currentLine.inferType = 'file';
      }

    })
    .when((prevLineIndent, currentLineIndent) => {
      return prevLineIndent > currentLineIndent;

    }, (prevLineIndent, currentLineIndent,
       linesInfo, currentLine,
       isFirstLine, validationResults) => {

      //Line is the sibling of top level sibling
      //Obvious check case, but need further checks below
      logTopLevel(linesInfo, currentLine);

      //Use the previous line and navigate back up
      //the levels until the indent level is the same as the current line
      let prevLine = linesInfo.prevLineInfo;

      for (let i = 0; i < linesInfo.contentLineCount; i++) {

        //Validate the indent level of child relative to parent
        logValidations(
          validator.properIndentLevel(linesInfo.firstLine.nameDetails.indentAmount, linesInfo.totalLineCount,
            currentLine.structureName, linesInfo.firstIndentationAmount,
            prevLine.nameDetails.indentAmount, currentLineIndent,
            linesInfo.firstIndentationType,
            currentLine.nameDetails.indentType, 'outdent',
            prevLine.parent,
            linesInfo.prevLineInfo.isFirstLine),
          validationResults);


        //Stop checks early when the parent line is the first line
        if (prevLine.parent === null) {
          i = linesInfo.contentLineCount;
          return;
        }

        if (prevLine.parent.nameDetails.indentAmount ===
          currentLineIndent) {

          //Same prior level of indent means the prior is
          //a sibling to the current line
          if (prevLine.parent.sibling.length === 0) {
            prevLine.parent.sibling.push(currentLine);

            //Check against last line having less indent than previous
            if (prevLine.parent.parent !== null) {
              prevLine.parent.parent.children.push(currentLine);
            }
          }

          //Check against last line having less indent than previous
          if (prevLine.parent.parent !== null) {
            currentLine.parent = prevLine.parent.parent;
          }

          //Assume currentline to be a file, unless proven later on
          if (typeof currentLine.inferType === 'undefined') {
            currentLine.inferType = 'file';
          }

          logChildrenLevel(linesInfo, currentLine);

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
  relations: (linesInfo, currentLine, isFirstLine, validationResults) => {

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
          currentLine.nameDetails.indentAmount, linesInfo,
          currentLine, false, validationResults);

    } else if (linesInfo.contentLineCount === 1 &&
      currentLine.structureName.length > 0 && isFirstLine) {
      singleLineInfoFunctions.setStructureTypeByChar(currentLine);

      //First content line
      singleLineInfoFunctions
        .compareIndent(
          linesInfo.prevLineInfo.nameDetails.indentAmount,
          currentLine.nameDetails.indentAmount, linesInfo,
          currentLine, isFirstLine, validationResults);
    }
  },
  updatePrevLine: (linesInfo, currentLine) => {
    linesInfo.prevLineInfo = currentLine;
  }
};

export default singleLineInfoFunctions;

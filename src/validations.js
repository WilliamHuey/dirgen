'use strict';

//Vendor modules
import _ from 'lodash';

//Source modules
import message from './messages';

let validator = () => {};

//validator.<rule>(<data>, <callback>, <callback arguments>)
Object.assign(validator.prototype, {
  presenceFirstLine: (firstLine, callback, callbackArgs) => {

    if (!_.isNull(firstLine)) {
      callback.apply(null, callbackArgs);
    } else {
      message.error('Supplied template file has no content to generate.');
    }
  },
  properIndentLevel: (lineNum, content, firstIndentAmt, prevLineIndentAmt, currentIndentAmt,
  firstIndentType, currentIndentType, indentType) => {
    //TODO: pretty error needs to stop execution outright
    if (indentType === 'outdent' && !(currentIndentAmt % firstIndentAmt === 0) &&
    !(currentIndentAmt >= firstIndentAmt)) {
      // console.log(`Line num: ${lineNum}` + "outdented string");
      throw (message.error(`Line #${lineNum}:
         '${content.trim()}', has indent amount of ${currentIndentAmt} ${currentIndentType}(s) which is inconsistent with the first defined outdent of ${firstIndentAmt} ${firstIndentType}(s).`));
    }
    // console.log("lineNum", lineNum);
    // console.log("now currentIndentAmt", currentIndentAmt);
    //Scaling indent factor and firstIndent is the same
    if (indentType !== 'outdent' && !(Math.abs(currentIndentAmt - prevLineIndentAmt) ===
       firstIndentAmt)) {
      // console.log("on line", lineNum);
      // console.log("not allowed indenting factor");
      throw (message.error(`Line #${lineNum}:
         '${content.trim()}', has an indent
         amount of ${Math.abs(currentIndentAmt - prevLineIndentAmt)} ${currentIndentType}(s) relative to parent folder,
         which is different from the
         first defined indent amount of ${firstIndentAmt} ${firstIndentType}(s).`));
    }
  },
  charCountUnder255: (count, lineNum, content, inferType) => {
    if (count > 255) {
      message.warn(`Line #${lineNum}: '${content}', has a character
        count of ${count}, which exceeds 255. ${inferType.charAt(0).toUpperCase() +
        inferType.slice(1)} was not created.`);
    }
  }
});

export default validator;
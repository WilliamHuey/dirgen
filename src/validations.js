'use strict';

//Vendor modules
import _ from 'lodash';

//Source modules
import message from './messages';

let validator = () => {};

//validator.<rule>(<data>, <callback>, <callback arguments>)
_.assign(validator.prototype, {
  presenceFirstLine: (firstLine, callback, callbackArgs) => {

    if (!_.isNull(firstLine)) {
      callback.apply(null, callbackArgs);
    } else {
      message.error('Supplied template file has no content to generate.');
    }
  },
  charCountUnder255: (count) => {
    if(count > 255) {
      message.warn(`Current line count of ${count}, exceeds 255.`);
    }
  }
});

export default validator;
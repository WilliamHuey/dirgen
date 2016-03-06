'use strict';

//Vendor modules
import _ from 'lodash';

let validator = () => {};

//validator.<rule>(<data>, <callback>, <callback arguments>)
_.assign(validator.prototype, {
  presenceFirstLine: (linesInfo, callback, rootPath) => {

    if (!_.isNull(linesInfo.firstLine)) {
      callback.call(null, linesInfo, rootPath);
    }

    //TODO: throw a warning message
    //Does the pretty error module
    //support warning level errors
  }
});

export default validator;
'use strict';

//Vendor modules
import _ from 'lodash';
import PrettyError from 'pretty-error';

let validator = () => {};

const generateError = (msg) => {
  return (new PrettyError()).render(new Error(msg));
};

const throwError = (msg) => {
  console.error(generateError(msg));
};

//validator.<rule>(<data>, <callback>, <callback arguments>)
_.assign(validator.prototype, {
  presenceFirstLine: (firstLine, callback, callbackArgs) => {

    if (!_.isNull(firstLine)) {
      callback.apply(null, callbackArgs);
    } else {
      throwError('Supplied template file has no content to generate.');
    }
  }
});

export default validator;
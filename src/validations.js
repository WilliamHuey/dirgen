'use strict';

//Vendor modules
import _ from 'lodash';

import RenderKid from 'renderkid';
import PrettyError from 'pretty-error';

let renderKid = new RenderKid();
let prettyError = new PrettyError();

renderKid.style({
  "message": {
    display: "inline",
    marginLeft: "2",
    background: "white",
    color: "black"
  },
  "message-header": {
    background: "red",
    color: "black",
    marginRight: "1",
    padding: "2"
  }
});

prettyError.appendStyle({
  'pretty-error > header > title > kind': {
      display: 'none'
   },
   'pretty-error > header > colon': {
      display: 'none'
   },
   'pretty-error > header > message': {
      display: 'none'
   }
});

let validator = () => {};

//validator.<rule>(<data>, <callback>, <callback arguments>)
_.assign(validator.prototype, {
  presenceFirstLine: (firstLine, callback, callbackArgs) => {

    if (!_.isNull(firstLine)) {
      callback.apply(null, callbackArgs);
    } else {
      // logType({info: 'Supplied template file has no content to generate.'});
      let output = renderKid.render("<message><message-header>Error:</message-header>Supplied template file has no content to generate.</message>");
      console.log(output);
      let renderedError = prettyError.render(new Error('Some error'));
      console.log(renderedError);
    }
  }
});

export default validator;
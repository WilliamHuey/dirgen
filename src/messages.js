'use strict';

import RenderKid from 'renderkid';
import PrettyError from 'pretty-error';

let renderKid = new RenderKid();
let prettyError = new PrettyError();

renderKid.style({
  "message": {
    display: "inline",
    background: "white",
    color: "black",
    paddingTop: 1
  },
  "message-header": {
    background: "red",
    color: "black",
    padding: 2
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

const messageTemplate = (msg) => {
  return `<message>
    <message-header>
      Error:
    </message-header>
    ${msg}
  </message>`;
};

const displayMessage = (msg) => {
  console.log(renderKid.render(messageTemplate(msg)));
};

const displayStack = (msg) => {
  console.error(prettyError.render(new Error(msg)));
};

const message = {
  error: (msg) => {
    displayMessage(msg);
    displayStack(msg);
  },
  warn: (msg) => {
    displayMessage(msg);
  }
};

export default message;
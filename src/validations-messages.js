'use strict';

//Vendor modules
import RenderKid from 'renderkid';
import PrettyError from 'pretty-error';

const renderKid = new RenderKid();
const prettyError = new PrettyError();

renderKid.style({
  "message": {
    display: "inline",
    background: "white",
    color: "black",
    paddingTop: 1
  },
  "message-header-error": {
    background: "red",
    color: "black",
    padding: 2
  },
  "message-header-warning": {
    background: "orange",
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

const messageTemplate = (msg, type) => {
  return `<message>
    <message-header-error>
      ${type}
    </message-header-error>
    ${msg}
  </message>`;
};

const displayMessage = (msg, type) => {
  console.log(renderKid.render(messageTemplate(msg, type)));
};

const displayStack = (msg) => {
  return console.log(prettyError.render(new Error(msg)));
  // process.exit();
};

const message = {
  error: (msg) => {
    displayMessage(msg, 'Error:');
    displayStack(msg);
  },
  warn: (msg) => {
    displayMessage(msg, 'Warning:');
  }
};

export default message;

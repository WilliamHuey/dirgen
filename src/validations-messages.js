'use strict';

//Vendor modules
import RenderKid from 'renderkid';

const renderKid = new RenderKid();

renderKid.style({
  'message-text': {
    display: 'inline',
    background: 'white',
    color: 'black',
    paddingLeft: 1
  },
  'message-header-error': {
    background: 'red',
    color: 'black',
    padding: 2
  },
  'message-header-warning': {
    background: 'yellow',
    color: 'black',
    padding: 2
  }
});

const messageTemplate = (msg, type) => {
  if (type === 'Warning:') {
    return `
      <message-header-warning>
        ${type}
      </message-header-warning>
      <message-text>
        ${msg}
      <message-text>
      <br>`;
  } else {
    return `
      <message-header-error>
        ${type}
      </message-header-error>
      <message-text>
        ${msg}
      <message-text>
    <br>`;
  }
};

const displayMessage = (msg, type) => {
  console.log(renderKid.render(messageTemplate(msg, type)));
};

const message = {
  error: (msg) => {
    displayMessage(msg, 'Error:');
  },
  warn: (msg) => {
    displayMessage(msg, 'Warning:');
  }
};

export default message;
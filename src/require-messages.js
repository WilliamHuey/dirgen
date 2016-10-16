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
  'message-header-generated': {
    background: 'green',
    color: 'black',
    padding: 1
  },
  'message-header-skipped': {
    background: 'yellow',
    color: 'black',
    padding: 1
  },
  'message-header-overwritten': {
    background: 'orange',
    color: 'black',
    padding: 1
  }
});

const messageTemplate = (onlineType, line, type, structureName) => {
  if (onlineType === 'Generated') {
    return `
      <message-header-generated>
        ${onlineType}:
      </message-header-generated>
      <message-text>
        Line #${line} (${type}): ${structureName}
      <message-text><br>`;
  } else if (onlineType === 'Skipped') {
    return `
      <message-header-skipped>
        ${onlineType}:
      </message-header-skipped>
      <message-text>
        Line #${line} (${type}): ${structureName}
      <message-text><br>`;
  } else if (onlineType === 'Overwritten') {
    return `
      <message-header-overwritten>
        ${onlineType}:
      </message-header-overwritten>
      <message-text>
        Line #${line} (${type}): ${structureName}
      <message-text><br>`;
  }
};

//General log message on an 'onLine' event action
const onLineLog = (onlineType, line, type, structureName) => {
  return renderKid.render(messageTemplate(onlineType, line, type, structureName));
};

export default {

  onLineGenerated: (line, type, structureName) => {
    return onLineLog('Generated', line, type, structureName);
  },

  onLineSkipped: (line, type, structureName) => {
    return onLineLog('Skipped', line, type, structureName);
  },

  onLineOverwritten: (line, type, structureName) => {
    return onLineLog('Overwritten', line, type, structureName);
  }
};
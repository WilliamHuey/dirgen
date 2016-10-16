const onLineLog = (onlineType, line, type, structureName) => {
return `${onlineType}: Line #${line} (${type}): ${structureName}`;
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
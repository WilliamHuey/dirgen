export default (messageOut, messageType, messages, messageCount) => {
  let messagesKeyCount = messages.length;
  for (let i = 0; i < messagesKeyCount; i++) {
    messageOut[messageType](messages[i].message);
  }
};

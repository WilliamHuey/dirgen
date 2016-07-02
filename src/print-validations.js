export default (messageOut, messageType, messages, messageCount) => {
  messages.forEach((message) => {
    messageOut[messageType](message.message);
  });
};

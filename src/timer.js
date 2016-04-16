let timer = () => {};

Object.assign(timer.prototype, {
  onExit: (time) => {
    process.on('exit', () => {
      let timeDiff = process.hrtime(time);
      console.log('Time elapsed for file(s) and folder(s) generation: %d nanoseconds', timeDiff[0] * 1e9 + timeDiff[1]);
    });
  }
});

export default timer;

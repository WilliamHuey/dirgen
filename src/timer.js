let timer = () => {};

Object.assign(timer.prototype, {
  onExit: (time) => {
    process.on('exit', () => {
      let timeDiff = process.hrtime(time);
      console.log('Generation Time: %d nanoseconds', timeDiff[0] * 1e9 + timeDiff[1]);
    });
  }
});

export default timer;

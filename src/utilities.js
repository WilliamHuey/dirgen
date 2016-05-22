export default {
  isObject: (obj) => {
    let checkedType = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && checkedType === 'Object';
  }
};
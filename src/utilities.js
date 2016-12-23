const getCheckedType = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

const toString = Object.prototype.toString;

export default {
  isObject: (obj) => {
    const checkedType = getCheckedType(obj);
    return typeof obj !== 'undefined' &&
      obj !== null && checkedType === 'Object';
  },
  isBoolean: obj => (toString.call(obj) === '[object Boolean]'),
  pluralize: (str, num) => {
    if (num <= 1) {
      return str;
    } else {
      return `${str}s`;
    }
  }
};
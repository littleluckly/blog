const instanceOf = (left, constructor) => {
  let proto = Object.getPrototypeOf(left); // 或者proto=left.__proto__
  let prototype = constructor.prototype;
  while (true) {
    if (!proto) {
      return false;
    }
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
};

function myNew(ctor, ...params) {
  // 注意箭头函数没有prototype
  if (typeof ctor !== "function" || !ctor.prototype) {
    return new Error("ctor is not constructor");
  }
  const obj = Object.create(ctor.prototype);
  const res = ctor.apply(obj, params);
  if (["object", "function"].includes(res) && res !== null) {
    return res;
  }
  return obj;
}

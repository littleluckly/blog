//
Function.prototype.myCall = function (...args) {
  let [ctx, ...params] = args;
  ctx = ctx || window;
  if (typeof this !== "function") {
    return new Error("not function");
  }
  ctx.fn = this;
  const res = ctx.fn(...params);
  delete ctx.fn;
  return res;
};

// test
const obj = {
  value: 1,
};
function fn() {
  console.log(this.value);
}
fn();
fn.myCall(obj);

Function.prototype.myBind = function (ctx, ...args) {
  const fn = this;
  return function F() {
    return fn.apply(
      this instanceof F ? this : ctx,
      args.concat([...arguments])
      // 效果等同
      // args.concat(...arguments)
    );
  };
};

// test
const obj = {
  val: 2,
  fn() {
    console.log(this.val);
  },
};
const fn = function (...args) {
  console.log(this.val);
  console.log(args);
};
const fnBind = fn.myBind(obj, "a");
fnBind("b");

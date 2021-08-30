// 原函数
const fn = () => {
  console.log("fn");
};

// 包装原函数，在fn函数执行前，处理一段自己的逻辑
const fnBefore = (fn) => {
  return (...args) => {
    console.log("fn-before");
    fn(...args);
  };
};

// const fnDecoretor = fnBefore(fn);
// fnDecoretor();

// 封装通用的before方法
Function.prototype.before = function (beforeFn) {
  const originFn = this;
  return (...args) => {
    beforeFn();
    originFn(...args);
  };
};

const newFn = fn.before(() => {
  console.log("before");
});
newFn();

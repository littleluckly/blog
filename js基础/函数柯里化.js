// 函数柯里化：
// 函数传参一元化
// 比如一个函数入参有三个sum(a,b,c), 经过柯里化处理后，可以分批传参而且每次只传一个参数，如sum(a)(b)(c), 只有当函数传参个数满足要求后才执行

// 偏函数：
// 也是分批函数，与柯里化的区别是，每次传参可以不固定
// 还是上文的sum函数，经过偏函数处理后可以通过sum(a,b)(c)或者sum(a)(b,c)
// 可以说柯里化是一种特殊的偏函数

const curring = function (fn, preargs = []) {
  // 记录fn函数的参数个数
  const len = fn.length;
  const _this = this;
  return function (...args) {
    const newArgs = [...preargs, ...args];
    if (newArgs.length < len) {
      return curring.call(_this, fn, newArgs);
    }
    return fn.apply(this, newArgs);
  };
};
const sum = (a, b, c, d) => {
  return a + b + c + d;
};
const sumCurry = curring(sum);
console.log(sumCurry(1)(2)(3)(4));
console.log(sumCurry(1, 2, 3)(4));

// 柯里化的应用
// 获取变量类型
// 先看下不使用柯里化的情况
// const isType = (type) => {
//   return (variable) =>
//     Object.prototype.toString.call(variable) === `[object ${type}]`;
// };
// const isString = isType("String");
// const isNumber = isType("Number");
// console.log(isString("123"));
// console.log(isString(123));

// 使用柯里化改造
const isType = (type, variable) => {
  return Object.prototype.toString.call(variable) === `[object ${type}]`;
};
const isTypeCurring = curring(isType);
const isString = isTypeCurring("String");
const isObject = isTypeCurring("Object");
console.log(isString("123"));
console.log(isObject({ a: "test" }));

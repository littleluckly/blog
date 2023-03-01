// redux极简版本
// function compose(...funcs) {
//   if (funcs.length === 0) {
//       return arg => arg
//   }

//   if (funcs.length === 1) {
//       return funcs[0]
//   }

//   return funcs.reduce((a, b) => (...args) => a(b(...args)))
// }
const compose = function () {
  const fns = [...arguments];
  return function () {
    const args = [...arguments];
    return fns.reverse().reduce((prev, fn, idx) => {
      if (idx === 0) {
        return fn.apply(null, args);
      }
      return fn(prev);
    });
  };
};

const fn1 = (a) => {
  return a + 1;
};
const fn2 = (a) => {
  return a + 2;
};
const composefn = compose(fn2, fn1);
console.log(composefn(3));
console.log(fn1.apply(null, [1]));

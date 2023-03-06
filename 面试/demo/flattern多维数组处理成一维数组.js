// 利用concat和递归

// concat自身具有降维特性
// const arr = [11].concat([22, [33]]);
// console.log(arr); // [ 11, 22, [ 33 ] ]
// 写法等同于 [11, ...[22,[33]]]

// 利用递归
// const flattern = (arr) => {
//   if (!Array.isArray(arr)) {
//     return arr;
//   }
//   return [].concat(...arr.map(flattern));
// };
// console.log(flattern([11, [22, [33, [44]]]]));

// 简写版
const flattern = (arr) =>
  Array.isArray(arr) ? [].concat(...arr.map(flattern)) : arr;

console.log(flattern([11, [22, [33, [44]]]]));

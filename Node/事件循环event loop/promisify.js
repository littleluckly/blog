// promise风格的api
// 示例
// const fs = require("fs").promises;
// fs.readFile("promise.js", "utf8").then((data) => {
//   console.log(data);
// });

// 手动实现一个promiseify, 将fs的api包装程promise风格
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  };
}
const fs = require("fs");
// const readFile = promisify(fs.readFile);
// readFile("promise.js", "utf8").then((data) => {
//   console.log(data);
// });

// 处理fs对象上的所有方法，全部包装成promisify风格
function promisifyAll(target) {
  Reflect.ownKeys(target).forEach((key) => {
    if (typeof target[key] === "function") {
      target[key + "Async"] = promisify(target[key]);
    }
  });
  return target;
}

let fsPromisify = promisifyAll(fs);
fsPromisify
  .readFileAsync("promise.js", "utf8")
  .then((data) => console.log(data));

// node自带一个util库，提供了promisify方法

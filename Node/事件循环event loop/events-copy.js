// node内置模块，发布订阅
const EmitterCenter = require("events");
// on emit once off

// 一：可以通过继承原型的方式实现一个自己的发布订阅
function Girl() {}

// 1. Object.create
// Girl.prototype = Object.create(EmitterCenter.prototype);
// 2. Object.setPrototypeOf
// Object.setPrototypeOf(Girl.prototype, EmitterCenter.prototype);
// 3.
// console.log(Girl.prototype.__proto__ === Object.prototype);
Girl.prototype.__proto__ = EmitterCenter.prototype;
const girl = new Girl();
girl.on("女生失恋", () => {
  console.log("cry");
});
girl.emit("女生失恋");

// 二：自己实现
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(name, fn) {
    this.events[name] = this.events[name] || [];
    this.events[name].push(fn);
  }
  emit(name, ...args) {
    this.events[name] && this.events[name].forEach((fn) => fn(args));
  }
  off(name, fn) {
    this.events = this.events.filter(
      (item) => item !== fn && item.refener !== fn
    );
  }
  once(name, fn) {
    // 利用装饰器函数包装fn, 实现触发事件后立即删除功能
    const newFn = (...args) => {
      fn(...args);
      this.off(newFn);
    };
    // 修复在触发前手动off不生效问题
    newFn.refener = fn;
    this.on(name, newFn);
  }
}

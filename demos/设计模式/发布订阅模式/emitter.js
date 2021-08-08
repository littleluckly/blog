class Emitter {
  constructor() {
    this.eventList = {};
  }
  subscribe(eventName, fn) {
    if (!this.eventList[eventName]) {
      this.eventList[eventName] = [];
    }
    this.eventList[eventName].push(fn);
  }
  publish(eventName, ...args) {
    const fns = this.eventList[eventName];
    if (!fns || fns.length === 0) {
      return;
    }
    fns.forEach((fn) => {
      fn.apply(this, args);
    });
  }
  remove(eventName, fn) {
    const fns = this.eventList[eventName];
    if (!fns || fns.length === 0) {
      return;
    }
    const idx = fns.findIndex((item) => item === fn);
    fns.splice(idx, 1);
  }
}

const csdn = new Emitter();
const fn = function (medals) {
  console.log("中国奖牌数：", medals);
};
csdn.subscribe("china-medal", fn);

csdn.publish("china-medal", "34金24银16铜");
csdn.publish("china-medal", "43金30银27铜");

setTimeout(() => {
  csdn.remove("china-medal", fn);
  csdn.publish("china-medal", "奥运会结束啦，不能发布了");
}, 1000);

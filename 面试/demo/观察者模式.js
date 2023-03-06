// 观察者模式 vs 发布订阅模式
// 两者类似，网上也有把他们称之为同一种设计模式
// 其实他们是有区别的，
// 发布订阅有一个中介者，使用过vue的比较好理，因为vue中有个事件总线的概念，利用事件总线实现事件的订阅和发布
// 如：
class EventCenter {
  constructor() {
    this.events = [];
  }
  // 订阅
  on(fn) {
    this.events.push(fn);
  }
  // 发布
  emit() {
    this.events.forEach((fn) => fn());
  }
}
const emitter = new EventCenter();
// 订阅
emitter.on(() => {
  console.log("我订阅了");
});
// 发布
emitter.emit();

// 而观察者模式，没有中介者概念，只有观察者和被观察者, 由被观察者通知观察者，即被观察者触发事件通知
// vue的依赖收集和发布就是利用了观察者模式
// 观察者
class Oberserve {
  constructor(name) {
    this.name = name;
  }
  update() {
    console.log(`观察者${this.name}接收到了变化`);
  }
}
// 被观察者可以是任意类
// 这里的被观察就是就是上文中发布订阅模式EventCenter
class Dep {
  constructor(name) {
    this.name = name;
    this.observes = [];
  }
  attach(o) {
    this.observes.push(o);
  }
  notify() {
    this.observes.forEach((fn) => fn.update());
  }
}

const ob1 = new Oberserve("A");
const dep = new Dep("被观察者1");
dep.attach(ob1);
dep.notify();

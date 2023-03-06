> 开篇废话：本篇文章介绍发布-订阅模式，想必很多人听说过有一种观察者模式，网上既有资料说这是两种不同的设计模式，也有说这是一种模式，我倾向于认同他们是同一种设计模式。不必过于纠结

> 开篇楔子：东京奥运会已经开幕有一段时间了，在本次奥运会上我国的奥运健儿们取得了非常不错的成绩，截止至目前(2021.08.05)，我国取得了34金24银16铜，在上班时间也时刻关注着比赛详情，但对于打工人来说摸鱼看完整比赛可能做不到，但是偶尔刷新查看一下奥运奖牌榜的事没少干。然后我就在想要是谁能及时通知我奖牌数的变化就好了，假设csdn提供了奖牌数据，我点击关注订阅后，然后csdn实时给我推送最新的奖牌榜，这不就是一个订阅-发布模式吗



用代码实现发布-订阅模式，获取奥运奖牌数，主要有三步

- 保存所有订阅信息， eventList
- 提供订阅方法，将订阅事件保存到eventList中
- 提供一个发布方法，将所有订阅的事件发布出去

```js
class Emitter {
  constructor() {
    // 保存所有订阅的事件
    this.eventList = {};
  }
  // 订阅事件：事件名称，事件处理函数
  subscribe(eventName, fn) {
    if (!this.eventList[eventName]) {
      this.eventList[eventName] = [];
    }
    this.eventList[eventName].push(fn);
  }
  // 发布事件：事件名称，参数
  publish(eventName, ...args) {
    const fns = this.eventList[eventName];
    if (!fns || fns.length === 0) {
      return;
    }
    fns.forEach((fn) => {
      fn.apply(this, args);
    });
  }
}

const csdn = new Emitter();
csdn.subscribe("china-medal", function (medals) {
  console.log("中国奖牌数：", medals);
});

csdn.publish("china-medal", "34金24银16铜"); // 输出：中国奖牌数： 34金24银16铜
csdn.publish("china-medal", "43金30银27铜"); // 输出：中国奖牌数： 43金30银27铜
```

输出结果：

```html
中国奖牌数： 34金24银16铜
中国奖牌数： 43金30银27铜
```



如果奥运会结束，我就不需要再关注奖牌数，这时需要一个取消订阅事件remove

```js
class Emitter {
 // 省略其他代码xxx
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

```



vue2.x的数据更新视图过程也是利用到了发布-订阅模式，感兴趣的可以观看我的另一文章 [极简系列---vue 响应式实现(2.x)](https://blog.csdn.net/hncu1990/article/details/118856626)

vue表单组件也适用了发布-订阅模式，感兴趣的戳这里：[极简系列---vue3.x表单组件form](https://blog.csdn.net/hncu1990/article/details/119299471)


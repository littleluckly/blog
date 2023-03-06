### Dep

收集依赖，采用事件订阅发布模式

#### Dep-实现watchEffect

在实现具体细节之前我们先实现一个大致框架，确定整个流程

首先得实现一个发布订阅模式Dep，收集所有的订阅，比如收集watchEffect

```js
class Dep {
  constructor() {
    this.subscribes = new Set();
  }
  // 收集依赖，可以理解添加订阅
  depend() {}
  // 发布
  notify() {
    this.subscribes.forEach((effect) => {
      effect();
    });
  }
}
```

有了发布订阅，接下来实现watchEffect

watchEffect会在初始化的时候立即执行一次

```js
const dep = new Dep();
function watchEffect(effect) {
  // 立即执行
  effect();
}

watchEffect(() => {
  dep.depend();// TODO:收集依赖
  console.log('effect');
});
dep.notify();
```

上面就是基于Dep实现watchEffect的大致框架，还有如下细节没有实现

- depend方法未实现，用户的effect并没有被收集到
- dep实例没有初始值

```js
let activeEffect = null;
class Dep {
  constructor(value) {
    this.subscribes = new Set();
    this._value = value;
  }
  get value() {
    return this._value;
  }
  set value(newValue) {
    this._value = newValue;
  }
  depend() {
    if (activeEffect) {
      this.subscribes.add(activeEffect);
    }
  }
  notify() {
    this.subscribes.forEach((effect) => {
      effect();
    });
  }
}

const dep = new Dep("hello");
function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

watchEffect(() => {
  dep.depend();// 在watchEffect内部，将effect赋值给了activeEffect,确保了depend
  console.log(dep.value);
});

dep.value = "changed";
dep.notify();
```

在实现watchEffect的时候引入了一个非常意思的全局变量activeEffect，通过这个变量我们拿到用户的effect，
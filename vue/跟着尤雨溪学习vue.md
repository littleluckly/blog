>  尤雨溪在国外的一个教学视频：[戳此处](https://www.bilibili.com/video/BV1rC4y187Vw?p=5)

## 基础知识梳理

#### vue的渲染流程简单版本

template模板====>经过编译器compiler编译生成vdom====>mount生成真实dom挂载到页面容器上====>数据更新，生成新的vdom====>patch比较新旧vdom,更新页面。



compiler编译生成的vdom就是我们用[渲染函数](https://v3.cn.vuejs.org/guide/render-function.html)所写的代码

如生成一段html`<div class="red"><span>hello</span></div>`，对应的渲染函数写法是：

```javascript
h("div", { class: "red" }, [h("span", null, "hello")])
```



视频介绍了如何把这一段vdom转成真实dom渲染到页面上

首先，准备定义一个h函数，mount方法，一段vdom

```html
<style>
  .red {
    color: red;
  }
</style>
<div id="app"></div>
<script>
  function h(tag, props, children) {
    return { tag, props, children };
  }

  function mount(vnode, container) {
    // TODO 根据vnode.tag生成html标签
    // TODO 解析vnode.props 
    // TODO 解析vnode.children
  }

  const vdom = h("div", { class: "red" }, [h("span", null, "hello")]);

  mount(vdom, document.getElementById("app"));
</script>

```



#### h函数

h函数接受三个参数，

- 标签类型
- props参数（包括属性property, attribute, 事件等等）
- children

```js
  function h(tag, props, children) {
    return { tag, props, children };
  }
```





#### mount

用来解析虚拟dom，生成真实dom，并将其挂载到容器container上

接受两个参数

- vnode，即上面h函数返回的虚拟dom
- container, 挂载的容器

```js
  function mount(vnode, container) {
    const el = document.createElement(vnode.tag);
    if (vnode.props) {
      for (const key in vnode.props) {
        const value = vnode.props[key];
        el.setAttribute(key, value);
      }
    }
    if (vnode.children) {
      if (typeof vnode.children === "string") {
        el.textContent = vnode.children;
      } else {
        vnode.children.forEach((child) => {
          mount(child, el);
        });
      }
    }
    container.appendChild(el);
  }
```



#### patch函数

比较新旧vdom，更新页面

```js

  const vdom2 = h("div", { class: "green" }, [h("span", null, "changed!")]);
  function patch(oldVNode, newVNode) {
    // 如果newVNode发生了变更，意味着需要更新真实dom，如果只是属性发生了变更，我们没有必要再重新生成新的dom，更新在mount阶段生成dom对应属性即可，所以为了拿到dom我们必须修改14行const el = document.createElement(vnode.tag);
    // 改成const el = vnode.el = document.createElement(vnode.tag);
    const el = oldVNode.el;
    if (oldVNode.tag === newVNode.tag) {
      // 比较属性props
      const oldProps = oldVNode.props || {};
      const newProps = newVNode.props || {};
      // 更新属性
      for (const key in newProps) {
        const oldValue = oldProps[key];
        const newValue = newProps[key];
        if (newValue !== oldValue) {
          el.setAttribute(key, newValue);
        }
      }
      // 删除属性
      for (const key in oldProps) {
        if (!(key in newProps)) {
          el.removeAttribute(key);
        }
      }

      // 比较children
      const oldChildren = oldVNode.children;
      const newChildren = newVNode.children;
      // 新children是文本
      if (typeof newChildren === "string") {
        if (typeof oldChildren === "string") {
          if (newChildren !== oldChildren) {
            el.textContent = newChildren;
          }
        } else {
          el.textContent = newChildren;
        }
      } else {
        // 新children是数组，旧children是文本
        if (typeof oldChildren === "stinrg") {
          el.innerHTML = "";
          newChildren.forEach((child) => {
            mount(child, el);
          });
        } else {
          // 新旧children都是数组
          const commonLenght = Math.min(oldChildren.length, newChildren.length);
          for (let i = 0; i < commonLenght; i++) {
            patch(oldChildren[i], newChildren[i]);
          }
          if (oldChildren.length < newChildren.length) {
            newChildren
              .slice(oldChildren.length)
              .forEach((child) => mount(child, el));
          } else if (oldChildren.length > newChildren.length) {
            oldChildren
              .slice(newChildren.length)
              .forEach((child) => el.removeChild(child));
          }
        }
      }
    } else {
      // 直接替换
    }
  }
  patch(vdom, vdom2);
```





#### Dep

收集依赖，采用事件订阅发布模式

##### Dep-实现watchEffect

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
- 需要手动订阅depend和发布notify

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
   	// value发生变化需要通知所有观察者更新
    this.notify()
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
```

在实现watchEffect的时候引入了一个非常意思的全局变量activeEffect，通过这个变量我们拿到用户的effect

>疑问1：在watchEffect函数中可以手动调用dep.depent(effect)，为什么需要额外引入一个全局变量activeEffect
>
>解答1：Dep有多个dep实例的时候，watchEffect函数中不清楚应该使用哪一个dep

> 疑问2：
> 在vue3实际使用过程中，并没有手动调用dep.depend订阅，真实的源码是如何做到的？

思考题：试想有这么一种场景，在某个watchEffect中依赖两个msg和ok两个Dep实例，理想情况下只有当ok.value发生了变化时，才会执行该watchEffect。在当前已实现的代码情况下，改变dep.value的值，该watchEffect也被执行了

```js
const dep = new Dep('hello')
const ok = new Dep(true )
watchEffect(()=>{
  if(ok.value){
    console.log(dep.value)
  }else{
    console.log('false branch')
  }
})
```

#### reactive响应式实现

reactive是vue3提供的一个将普通对象封装成响应式对象的方法，该方法传入一个普通对象，返回一个响应式对象。

该方法的实现依赖观察者Dep类，但是略微有些不一样，Dep不在需要保存value，因为reactive传入的对象上带有value，所以在实现reactive之前我们先要改造一下Dep

```js
class Dep {
  public subscribes = new Set();
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
```

reactive有两种实现方式，第一种是Object.defineProperty，这也是vue2.x实现响应式的原理

```js
  function reactive(raw) {
    Object.keys(raw).forEach((key) => {
      const dep = new Dep();
      let value = raw[key];
      Object.defineProperty(raw, key, {
        get() {
          dep.depend();
          return value;
        },
        set(newValue) {
          dep.notify();
          value = newValue;
        },
      });
    });
  }
```

第二种实现方式就是采用[proxy](https://es6.ruanyifeng.com/#docs/proxy)，在不考虑细节的情况下，你可能会写出如下的代码，这种代码能体现一个大致思路，但是存在2个致命的缺点

- get/set中没法确定是同一个dep
- 不同target的相同key没有区分

```js
 const hander = {
    get(target, key, receiver ) {
      dep = new Dep();
      dep.depend();
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      dep.notify();
      return result;
    },
  };
  function reactive(raw) {
    return new Proxy(raw, hander);
  }
```

让我们继续完善，补充以上两个缺点，主要是将普通对象，和对象的key缓存到targetMap中

```js
  const targetMap = new WeakMap();
  const getDep = (target, key) => {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      depsMap = new Map();
      targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
      dep = new Dep();
      depsMap.set(key, dep);
    }
    return dep;
  };
  const hander = {
    get(target, key, receiver) {
      const dep = getDep(target, key);
      dep.depend();
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      dep.notify();
      return result;
    },
  };
```


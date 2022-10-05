
> 用过vue的同学想必都知道它是基于`Object.defineProperty`实现的响应式，那么具体是怎么做到呢，下面我将用不到一百行代码逐步拆解响应式原理
>关于defineProperty可参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
>

## 拦截对象属性的存储行为
---
新建一个文件`my-vue.js`，在内部定义一个方法defineReactive，在方法内通过`Object.defineProperty`拦截对象属性的操作
```js
// my-vue.js
function defineReactive(obj, key) {
  // 此处形成了一个闭包, key, value不会被回收，会常驻内存
  // 先插个眼，后文提到的依赖更新dep.notify会利用到闭包这个特性
  let value = obj[key];
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log("get");
      return value;
    },
    set(v) {
      console.log("set");
      if (v === value) {
        return;
      }
      value = v;
    },
  });
}
```
为了及时纠错，我们可以每写完一个方法就进行一次测试，来验证代码是否有问题，执行命令`node my-vue.js`查看效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210717150632467.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70#pic_center)
目前来看已经实现了对属性的拦截，但是仅仅是处理了一个属性，所以我们还额外需要一个方法去遍历对象，给每个属性添加拦截行为
```js
function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key);
  });
}
```
此时仍然有缺陷，我们只处理了普通属性，对象嵌套的情况我们没有拦截到，所以我们要改写`defineReactive`方法，在进行赋值操作时要进行判断是否是一个对象，再次`observe`
```js
function defineReactive(obj, key) {
  let value = obj[key];
  // 此时value可能是一个对象，所以需要再次observe
  observe(value);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log("get");
      return value;
    },
    set(newVal) {
      console.log("set");
      if (newVal === value) {
        return;
      }
      // 此时value可能是一个对象，所以需要再次observe
      observe(newVal);
      value = newVal;
    },
  });
}
function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key);
  });
}
const obj = {
  test: "tttt",
  testObj: {
    chid: "child",
  },
};
observe(obj);
obj.testObj.chid = "update child";
console.log(obj.testObj.chid);
```

此时已经完成了对象所有属性的拦截。
还差的就是在数据变化时，以某种形式去渲染更新页面，在完成这一块内容前先了解一下vue的数据驱动视图原理
![在这里插入图片描述](https://img-blog.csdnimg.cn/2021071715412080.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70#pic_center)
先介绍下图中涉及到的一些概念

- new MVVM() 框架的构造函数如new Vue()
- Observer：执⾏数据响应化
 *说明：这一步我们已经在上文实现*
- Compile：编译模板，初始化视图，收集依赖（更新函数、watcher创建）
- Watcher：执⾏更新函数（更新dom）
- Dep：管理多个Watcher，批量更新

## new MYVUE() 框架构造函数的实现
---
```js
class MYVUE {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
	// 将数据处理成响应式
    observe(this.$data);
  }
}
```
定义了构造函数后，已初具雏形可以像使用vue一样去初始化，创建一个html实际体验一下初始化过程
```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="app">
      <p>表达式: <span>{{counter}}</span></p>
      <span>自定义指定v-text：</span><span v-text="counter"></span>
    </div>
    <script src="./my-vue.js"></script>
    <script>
      const app = new MYVUE({
        el: "#app",
        data: {
          counter: 1,
        },
      });
      
	    console.log(app.counter);
	    console.log(app.$data.counter);
    </script>
  </body>
</html>

```
此时你会发现第一个console.log的打印结果时undefined，第2个才能正确打印counter，因为在MYVUE构造函数内部，用户初始化的data挂载在`this.$data`中，所以不能直接访问，要解决此问题我们需引入代理的概念，实现用户访问`app.counter`时，返回的是`app.$data.counter`
```js
class MYVUE {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    observe(this.$data);
    proxy(this)
  }
}

function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(v) {
        vm.$data[key] = v;
      },
    });
  });
}
```

处理代理问题后回到上面的html文件中查看效果，发现已经能够正确打印app.counter了

## Compile实现，初始化视图

---

这一步主要是根据`new MYVUE`传递的el属性，解析html将表达式{{}}和自定义指令v-xxx等模板语法编译成对应的数据，主要实现方法如下：

```js
// 编译模板初始化视图 new Compile(el,vm)
class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)
    this.compile(this.$el)
  }

  compile($el) {
    $el.childNodes.forEach((node) => {
      if (this.isElement(node)) {
        // 判断是否是一个元素，nodeType === 1
        // 编译元素
        // 处理元素上的自定义指令
        this.compileElement(node)
      } else if (this.isExpression(node)) {
        // 如果是表达式 {{xxx}} 正则判断/\{\{(.*)\}\}/
        this.compileExpression(node)
      }

      if (node.childNodes) {
        this.compile(node)
      }
    })
  }
  // 编译元素，处理自定义指令
  compileElement(node) {
    Array.from(node.attributes).forEach((attr) => {
      const attrName = attr.name
      const exp = attr.value
      if (this.isDirective(attrName)) {
        // 获取指令名称， 如v-text的名称是text
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }
    })
  }

  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  isElement(node) {
    return node.nodeType === 1
  }

  isExpression(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  compileExpression(node) {
    // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
    node.textContent = this.$vm[RegExp.$1]
  }

  text(node, exp) {
    node.textContent = this.$vm[exp]
  }
}

```

再次回到html文件查看效果，目前为止效果还不错，已经能够正确初始化渲染页面
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210717173746418.png#pic_center)

## Watcher

---

如果尝试去修改data里的值，发现页面并不能更新，只有初始化的时候渲染了页面，因为缺少了依赖收集，所谓的依赖就是data中key被模板的使用到了，如果key值发生了变化，需要通知watcher更新视图。key每被引用一次就添加一个wather，也就是说一个key可能会有多个watcher，由依赖Dep管理这多个watcher，统一结合上文提供的vue数据驱动视图原理更容易理解。

总结就是

一个key对应一个Dep，

一个Dep管理该key多个引用依赖watcher

key每被引用一次就创建一个watcher

```js
// 页面中每引用一次key，就创建一个watcher
class Watcher {
  // updateFn：当key发生变化时，更新页面的方法
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;
  }

  // Dep通知watcher更新时触发的方法
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
```

Watcher类写好了，下一步就是找到key被引用的地方，创建一个watcher实例，而key被引用主要是在Compile中，所以我们把视角切换回Compile，在Compile中我们实现了`v-text`和`{{}}`两个可以动态引用data的地方，也就是引用key的地方，所以我们改写Compile类里`isExpression`和`text`，在这两个方法中创建watcher实例

添加watcher实例方法

```js
// 编译模板初始化视图 new Compile(el,vm)
class Compile {
  // ...省略其他代码...
  compileExpression(node) {
    // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
    // 初始化的时候需要执行一次
    node.textContent = this.$vm[RegExp.$1];

    new Watcher(this.$vm, RegExp.$1, function (val) {
      this.expressionUpdater(node, val);
    });
  }
  expressionUpdater(node, value) {
    node.textContent = value;
  }
  text(node, exp) {
    // 初始化的时候需要执行一次
    node.textContent = this.$vm[exp];

    // 更新时候执行watcher
    new Watcher(this.$vm, exp, function (val) {
      this.textUpdater(node, val);
    });
  }
  textUpdater(node, value) {
    node.textContent = value;
  }
  
  // ...省略其他代码...
}
```

修改完之后，不知道大家有没有发现`compileExpression`，`text`方法添加watcher实例有很多重复代码，所以我们可以进一步优化代码，将添加watcher的过程抽取成为一个通用方法`update`

```js
  update(node, exp, updaterPrefix) {
    // updaterPrefix相当于指令名称，此处可能取值expression、text
    const fn = this[updaterPrefix + "Updater"];
    fn && fn(node, this.$vm[exp]);

    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val);
    });
  }
```

重构之后Compile类完整代码为：

```js
// 编译模板初始化视图 new Compile(el,vm)
class Compile {
  constructor(el, vm) {
    console.log(el, vm);
    this.$vm = vm;
    this.$el = document.querySelector(el);
    this.compile(this.$el);
  }
  compile($el) {
    $el.childNodes.forEach((node) => {
      if (this.isElement(node)) {
        // 判断是否是一个元素，nodeType === 1
        // 编译元素
        // 处理元素上的自定义指令
        this.compileElement(node);
      } else if (this.isExpression(node)) {
        // 如果是表达式 {{xxx}} 正则判断/\{\{(.*)\}\}/
        this.compileExpression(node);
      }

      if (node.childNodes) {
        this.compile(node);
      }
    });
  }
  compileElement(node) {
    Array.from(node.attributes).forEach((attr) => {
      const attrName = attr.name;
      const exp = attr.value;
      if (this.isDirective(attrName)) {
        // 获取指令名称， 如v-text的名称是text
        const dir = attrName.substring(2);
        this[dir] && this[dir](node, exp);
      }
    });
  }
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  isExpression(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  update(node, exp, updaterPrefix) {
    // updaterPrefix相当于指令名称，此处可能取值expression、text
    const fn = this[updaterPrefix + "Updater"];
    fn && fn(node, this.$vm[exp]);

    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val);
    });
  }
  // 编译表达式
  compileExpression(node) {
    // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
    // node.textContent = this.$vm[RegExp.$1];

    // new Watcher(this.$vm, RegExp.$1, function (val) {
    //   this.expressionUpdater(node, val);
    // });
    this.update(node, RegExp.$1, "expression");
  }
  expressionUpdater(node, value) {
    node.textContent = value;
  }
  // 编译v-text指令
  text(node, exp) {
    // // 初始化的时候执行
    // node.textContent = this.$vm[exp];

    // // 更新时候执行watcher
    // new Watcher(this.$vm, exp, function (val) {
    //   this.textUpdater(node, val);
    // });

    this.update(node, RegExp.$1, "text");
  }
  textUpdater(node, value) {
    node.textContent = value;
  }
}
```

watcher创建之后，还不能执行，因为还需要Dep去通知watcher更新视图。

在编写Dep代码之前，先卖个关子，来看一下如果没有Dep，直接更新视图会是一个什么样的效果

定义一个全局变量 `const watchers = []`，然后Watcher类的构造器中将实例添加到watchers中，每次更新data时，更新视图

```js
const watchers = [];
// 页面中每引用一次key，就创建一个watcher
class Watcher {
  // updateFn：当key发生变化时，更新页面的方法
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;
    watchers.push(this)
  }

  // Dep通知watcher更新时触发的方法
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
```

更新data时，更新视图

```js
function defineReactive(obj, key) {
  let value = obj[key];
  observe(value);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      return value;
    },
    set(v) {
      if (v === value) {
        return;
      }
      observe(value);
      value = v;
      // data更新时，不经过Dep直接更新视图
      watchers.forEach((item) => item.update());
    },
  });
}
```

此时去html中加个定时器，发现页面确实实时刷新了，貌似不用直接通知watcher也能实现更新，不需要Dep

```js
      const app = new MYVUE({
        el: "#app",
        data: {
          counter: 1,
        },
      });
      setInterval(() => {
        console.log(app.counter++);
      }, 1000);
```

此时存在一个问题，data中任何一个值的更新，都会导致页面所有的依赖watcher更新，即整个页面全部重新渲染造成了性能的浪费。而Vue引入Dep概念就是为了解决这一个问题，将所有的watcher收集到每个key对应到dep实例中，这样每次更新data某个key时，只需要该key对应的dep通知它自己收集的watcher更新

```js
class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(watcher) {
    this.deps.push(watcher);
  }
  notify() {
    this.deps.forEach((watcher) => watcher.update());
  }
}
```

每一个key都会有一个对应的Dep，故我们会在defineReactive处理一个key时，实例化生成一个dep，此时出现了一个新的问题，在defineReactive阶段，watcher并没有生成，遇到了dep无watcher可以收集的情况，Vue的解决方案是在watcher实例化阶段，将实例作为静态属性挂载到Dep类上，然后再读取一次key触发一次get函数，在get函数中，收集watcher实例

```js
// 页面中每引用一次key，就创建一个watcher实例
class Watcher {
  // updateFn：当key发生变化时，更新页面的方法
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;
    // 将实例作为静态属性挂载到Dep类上
    Dep.watcher = this;
    // 读取一次key触发一次get函数
    this.vm[this.key];
    Dep.watcher = null;
  }

  // Dep通知watcher更新时触发的方法
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
```

收集watcher，data变化时更新视图

```js
function defineReactive(obj, key) {
  let value = obj[key];
  const dep = new Dep();
  observe(value);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 收集watcher
      Dep.watcher && dep.addDep(Dep.watcher);
      return value;
    },
    set(v) {
      console.log("set");
      if (v === value) {
        return;
      }
      observe(value);
      value = v;
      // 更新data时，触发该key对应的所有watcher，更新页面
      dep.notify();
    },
  });
}
```

至此一个极简的vue已经实现了啦！
收工！
喂！三点几了，做卵啊做，写饮茶先啦！
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210715222220937.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70#pic_center)
本文从零开始实现一个自定义的 vue2.x 表单组件`my-form`，组件使用体验类似 element-ui

实现过程涉及到的知识点

> 1. 自定义事件
> 2. 事件的广播与派发
> 3. v-mode 语法糖原理
> 4. $attrs，参考https://cn.vuejs.org/v2/api/#vm-attrs
> 5. provide/inject 传递数据，参考https://cn.vuejs.org/v2/api/#provide-inject

需求拆解

- 实现组件`my-form`，处理表单整体校验、表单 data 维护，表单 rules 校验规则维护
- 实现组件`my-form-item`，处理单个表单项组件的校验，显示表单 label, 校验错误信息
- 实现组件`my-input`用于测试表单组件

## my-form 组件基本结构

新建 my-form.vue，实现拆解需求提供的功能

1. 接受 model，保存表单数据
2. 接受校验规则
3. 提供表单整体校验方法 validate，调用子组件`my-form-item`的校验方法

_先上一段伪代码，展示组件基本结构_

```js
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true,
    },
    rules: Object,
  },
  methods: {
    validate() {},
  },
};
</script>
```

## my-form-item 组件基本结构

> async-validator 三方库实现校验，antd 和 ElementUi 也是使用的这个库，用法参考https://www.npmjs.com/package/async-validator

1. 接受`label`，用于显示表单项文本
2. 接受`prop`，当前表单项的 key，用于获取校验规则、表单项的值。
3. 提供`validate`方法，校验当前表单项
4. 注册自定事件 validate，表单项的具体控件如`my-input`在`blur`或者`change`时调用该方法进行校验

```js
<template>
  <div>
    div
    <label v-if="label">{{ label }}</label>
    <!-- 显示表单元素 -->
    <slot></slot>
    <!-- 显示错误信息 -->
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import Schema from "async-validator";
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    prop: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      error: "",
    };
  },
  mounted() {
    // 注册自定义事件validate，表单项的具体控件如my-input在blur或者change时调用该方法进行校验
    this.$on("validate", () => {
      this.validate();
    });
  },
  methods: {
    // my-form 调用
    validate() {},
  },
};
</script>

<style lang="less">
.error {
  color: red;
}
</style>
```

## my-form-item 组件校验方法

校验疑问：校验的过程其实就是规则和表单项的值进行匹配，但是`my-form-item`组件又没有保存表单项的值，该怎么办呢？回想下在使用 ElementUI 的时候，我们并没有显示传递表单项的值，她是怎样做到呢，其实是通过 provide/inject 实现的。

在`my-form`中将实例`provide`给子孙后代

```js
// my-form.vue文件
provide () {
    return {
      form: this,
    };
  },
```

在子孙后代组件`my-form-item`中通过`inject`接受

```js
// my-form-item.vue文件
import Schema from "async-validator"; // 用法参考https://www.npmjs.com/package/async-validator
export default {
  inject: ["form"],
  // xxx省略其他代码
  methods: {
    validate() {
      // 当前表单项校验
      // 获取校验规则和当前数据
      if (!this.prop) return;
      const rules = this.form.rules[this.prop];
      // 删除不用的属性，否则async-validator报错
      rules.forEach((item) => Reflect.deleteProperty(item, "trigger"));
      const value = this.form.model[this.prop];
      const validator = new Schema({ [this.prop]: rules });
      // 返回一个promise
      return validator.validate({ [this.prop]: value }, (errors) => {
        // errors存在则校验失败
        if (errors) {
          this.error = errors[0].message;
        } else {
          // 校验通过
          this.error = "";
        }
      });
    },
  },
};
```

## my-form 组件校验方法

`my-form-item`组件已基本实现校验，继续把目光放到 my-form 组件，它的校验思路是：

- 接受一个回调函数

- 收集所有的子组件`my-form-item`的`validate`并全部触发
- 将校验结果作为参数，传递给回调函数执行

```js
  methods: {
    validate (cb) {
      // 收集所有的子组件my-form-item的validate
      const tasks = this.$children
        .filter((item) => item.prop)
        .map((item) => item.validate());

      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => {
          console.log("catch-false");
          cb(false);
        });
    },
  },
```

在收集`my-form-item`的`validate`方法时，我们使用`this.$children`获取子组件，这里会有一个很大的问题，子组件`my-form-item`和`my-form`有可能不是直接父子关系，他们之间可能有其他组件或元素，所以我们需要一个方法去递归遍历`my-form`的所有子元素，找出所有的`my-form-item`触发 validate。其代码实现过程拆分成如下几个部分：

- 定义组件标识，要找出 item 组件，首先我们要给所有 item 组件加一个标识(组件名称)，此处继续参考 elementUI，每个组件都有一个 componentName 属性

  ```js
  // my-form-item.vue文件
  componentName: "my-form-item",
  ```

- 定义广播方法`broadcast`，用于递归遍历子元素，找出目标组件，触发目标事件

## broadcast 事件广播

定义 broadcast 方法递归遍历子元素，找出目标组件，触发目标事件，然后将其写入一个 mixins 里，方便每一个组件使用，

新建一个`emitter.js`文件：

```js
// emitter.js文件
function broadcast(componentName, eventName, params) {
  this.$children.forEach((child) => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
  },
};
```

用`broadcast`替换`my-form.vue`中`this.$children`的写法，解决父子组件耦合关系

```js
    // my-form.vue文件
  mixins:[emitter],
  methods: {
    validate (cb) {
      const tasks = this.broadcast('my-form-item','validate','')
      // const tasks = this.$children
      //   .filter((item) => item.prop)
      //   .map((item) => item.validate());

      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => {
          console.log("catch-false");
          cb(false);
        });
    },
  },
```

## my-input 组件

input 组件功能较为简单，主要是两个功能点

- 实现 v-model
- blur 和 input 事件触发校验
- $attrs 普通属性的传递

```js
<template>
  <div>
    <input
      :type="type"
      :value="value"
      @input="onInput"
      @blur="onBlur"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);
      this.$parent.$emit("validate", e.target.value);
    },
    onBlur() {
      this.$parent.$emit("validate", this.value);
    },
  },
};
</script>
```

## dispatch 事件派发

input 组件触发`my-form-item`的校验方法同样也会遇到 form 和 item 父子组件耦合的问题，他们的区别是 form 触发 item 组件校验事件是向下递归遍历寻找目标组件，触发目标事件，而 input 组件是向上寻找目标组件，触发目标事件。

继续回到 emitter.js 文件，实现 dispatch 方法

```js
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
```

用 dispath 方法改写 this.$parent，解决父子组件耦合问题

```js
  mixins: [emitter],
  methods: {
    onInput (e) {
      this.$emit("input", e.target.value);
      this.dispatch("my-form-item", "validate", e.target.value);
    },
    onBlur(){
      this.dispatch("my-form-item", "validate", this.value);
    }
  },
```

## 毛坯房验收

我们已经实现了一个极简版的 form 组件，和 input 组件，相当于建成了一个毛坯房，是时候验收了

验收清单

- 事件广播和派发 emitter.js

- my-form 组件
- my-form-item 组件
- my-input 组件

验收效果

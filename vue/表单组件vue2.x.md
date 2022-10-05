**本文从零开始实现一个自定义的**vue2.x表单组件`ti-form`，组件使用体验类似element-ui

实现过程涉及到的知识点

> 2. 事件的派发dispatch
> 3. v-mode语法糖原理
> 4. $attrs，参考https://cn.vuejs.org/v2/api/#vm-attrs
> 5. provide/inject传递数据，参考https://cn.vuejs.org/v2/api/#provide-inject

需求拆解

- 实现组件`ti-form`，处理表单整体校验(收集所有ti-form-item的validate)、表单data维护，表单rules校验规则维护
- 实现组件`ti-form-item`，处理单个表单项组件的校验，显示表单label, 校验错误信息
- 实现组件`ti-input`用于测试表单组件



## ti-form组件基本结构

新建ti-form.vue，实现拆解需求提供的功能

1. 接受model，保存表单数据
2. 接受校验规则
3. 提供表单整体校验方法validate，调用子组件`ti-form-item`的校验方法

*先上一段伪代码，展示组件基本结构*

```js
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: 'ti-form',// 自定义一个属性名，表示组件名称，在收集校验的方法是会用到
  props: {
    model: {
      type: Object,
      required: true,
    },
    rules: Object,
  },
  methods: {
    validate () {},
  },
};
</script>

```



## ti-form-item组件基本结构

> async-validator三方库实现校验，antd和ElementUi也是使用的这个库，用法参考https://www.npmjs.com/package/async-validator

1. 接受`label`，用于显示表单项文本
2. 接受`prop`，当前表单项的key，用于获取校验规则、表单项的值。
3. 提供`validate`方式，校验当前表单项
4. 注册自定事件validate，表单项的具体控件如`ti-input`在`blur`或者`change`时调用该方法进行校验

```js
<template>
  <div>
    div
    <label v-if="label">{{ label }}</label>
    <!-- 显示表单元素 -->
    <slot></slot>
    <!-- 显示错误信息 -->
    <p v-if="error"
       class="error">{{ error }}</p>
  </div>
</template>

<script>
import Schema from "async-validator";
export default {
  componentName: 'ti-form-item',
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
  data () {
    return {
      error: "",
    };
  },
  mounted () {
    // 注册自定义事件validate，表单项的具体控件如ti-input在blur或者change时调用该方法进行校验
    this.$on("validate", () => {
      this.validate();
    });
  },
  methods: {
    // ti-form 调用
    validate () {},
  },
};
</script>

<style lang="less">
.error {
  color: red;
}
</style>
```

## ti-form-item组件校验方法

校验疑问：校验的过程其实就是规则和表单项的值进行匹配，但是`ti-form-item`组件又没有保存表单项的值，该怎么办呢？回想下在使用ElementUI的时候，我们并没有显示传递表单项的值，她是怎样做到呢，其实是通过provide/inject实现的。

在`ti-form`中将实例`provide`给子孙后代

```js
// ti-form.vue文件
provide () {
    return {
      form: this,
    };
  },
```

在子孙后代组件`ti-form-item`中通过`inject`接受

```js
// ti-form-item.vue文件
import Schema from "async-validator"; // 用法参考https://www.npmjs.com/package/async-validator
export default {
  inject: ["form"],
  // xxx省略其他代码
  methods: {
    validate () {
      // 当前表单项校验
      // 获取校验规则和当前数据
      if(!this.prop) return
      const rules = this.form.rules[this.prop];
      // 删除不用的属性，否则async-validator报错
      rules.forEach(item=>Reflect.deleteProperty(item, 'trigger'))
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

## ti-form组件校验方法

表单项组件`ti-form-item`已基本实现校验，继续把目光放到ti-form组件，它也需要一个校验方法，用来在表单提交前校验所有的表单项`ti-form-item`，实现思路是：

- 接受一个回调函数

- 收集所有的子组件`ti-form-item`的`validate`并全部触发
- 将校验结果作为参数，传递给回调函数执行

```js
// ti-form.vue文件
methods: {
    validate (cb) {
      // 收集所有的子组件ti-form-item的validate
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

在收集`ti-form-item`的`validate`方法时，我们使用`this.$children`获取子组件，这里会有一个很大的问题，子组件`ti-form-item`和`ti-form`有可能不是直接父子关系，他们之间可能有其他组件或元素。

要解决这个父子组件跨代问题，我们可以在`ti-form`中注册一个自定义事件`ti.form.addField`，收集所有`ti-form-item`组件实例

```js
// ti-form.vue文件  
data() {
    return {
      fields: [],
    };
  },  
  // 注册一个自定义事件收集ti-form-item实例
  created() {
    this.$on("ti.form.addField", (field) => {
      if (field) {
        this.fields.push(field);
      }
    });
  },
```

然后在每个`ti-form-item`渲染完成后，触发`ti.form.addField`方法将当前实例保存到`ti-form`中，这里涉及到一个事件派发的概念dispatch

## dispatch事件派发

子组件`ti-form-item`触发父组件的自定义事件，需要一个方法去循环查找所有父组件，直到找到目标组件，然后触发目标事件。

我们把这个方法作为一个mixin，注入到子组件内

新建emitter.js文件

```js
export default {
  methods: {
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
  },
};
```

采用事件派发`dispatch`，将`ti-form-item`实例保存到`ti-form`中

```js
  // ti-form-item.vue文件
  mixins:[emitter],
  mounted() {
    if (this.prop) {
      this.dispatch("ti-form", "ti.form.addField", [this]);
    }
  },
```

更改this.$childrend写法

```js
// my-form.vue文件validate方法内：

// const tasks = this.$children
//   .filter((item) => item.prop)
//   .map((item) => item.validate());

const tasks = this.fields.map((item) => item.validate());
```

至此一个毛坯房（极简form组件）已基本完成，就差一个具体表单控件去体验效果了，下面将创建一个简单的输入框组件`ti-input`

## ti-input组件

input组件功能较为简单，主要是两个功能点

- 实现v-model
- blur和input事件触发校验
- $attrs普通属性的传递

```js
<template>
  <div>
    <input :type="type"
           :value="value"
           @input="onInput"
           @blur="onBlur"
           v-bind="$attrs" />
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
    onInput (e) {
      this.$emit("input", e.target.value);
      this.$parent.$emit("validate", e.target.value);
    },
    onBlur(){
      this.$parent.$emit("validate", this.value);
    }
  },
};
</script>

```



## 毛坯房验收

我们已经实现了一个极简版的form组件，和input组件，相当于建成了一个毛坯房，是时候验收了

验收清单

- 事件广播和派发emitter.js

- ti-form组件
- ti-form-item组件
- ti-input组件

验收效果




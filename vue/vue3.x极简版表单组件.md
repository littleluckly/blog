本文从零开始实现一个自定义的 vue3.x 表单组件`ti-form`，组件使用体验类似 element-ui。

完整代码地址：[https://github.com/littleluckly/vue3.x-components-study](https://github.com/littleluckly/vue3.x-components-study)

实现过程涉及到的知识点

> 1. setup 函数，用法参考：[https://v3.cn.vuejs.org/guide/composition-api-setup.html](https://v3.cn.vuejs.org/guide/composition-api-setup.html)
> 2. toRefs
> 3. ref
> 4. reactive
> 5. v-model
> 6. 事件订阅派发，采用第三方库`mitt`，用法参考[https://www.npmjs.com/package/mitt](https://www.npmjs.com/package/mitt)
> 7. 表单校验，第三方库`async-validator`，用法参考：[https://www.npmjs.com/package/async-validator](https://www.npmjs.com/package/async-validator)
> 8. provide/inject，父子/子孙数据传递，用法参考：[https://v3.cn.vuejs.org/guide/composition-api-provide-inject.html#provide-inject](https://v3.cn.vuejs.org/guide/composition-api-provide-inject.html#provide-inject)
> 9. 组件注册

需求拆解

- 实现组件`ti-form`，处理表单整体校验(收集所有 ti-form-item 的 validate)、表单 data 维护，表单 rules 校验规则维护
- 实现组件`ti-form-item`，处理单个表单项组件的校验，显示表单 label, 校验错误信息
- 实现组件`ti-input`用于测试表单组件

## ti-form 组件基本结构

新建 ti-form.vue，实现拆解需求提供的功能

1. 接受 model，保存表单数据
2. 接受校验规则
3. 提供表单整体校验方法 validate，调用子组件`ti-form-item`的校验方法

_先上一段伪代码，展示组件基本结构_

```js
<template>
  <form>
    <slot></slot>
  </form>
</template>
<script>
import { provide, reactive, toRefs } from "vue";
import mitt from "mitt";
export default {
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const fields = reactive([]);
    const emitter = mitt();

    const validate = () => {
      // TODO: 调用子组件ti-form-item的校验方法
    };

    emitter.on("ti.form.addField", (field) => {
      field && fields.push(field);
    });

    return { validate };
  },
};
</script>


```

## ti-form-item 组件基本结构

1. 接受`label`，用于显示表单项文本
2. 接受`prop`，当前表单项的 key，用于获取校验规则、表单项的值。
3. 提供`validate`方式，校验当前表单项
4. 注册自定事件 validate，表单项的具体控件如`ti-input`在`blur`或者`change`时调用该方法进行校验

```js
<template>
  <div class="ti-form-item">
    <label for="">
      {{ label }}
    </label>
    <slot></slot>
    <p class="errors">
      {{ error }}
    </p>
  </div>
</template>
<script>
import Schema from "async-validator";
import mitt from "mitt";
import { reactive, onMounted, ref, toRefs, provide, inject } from "vue";
export default {
  props: {
    label: {
      type: String,
    },
    prop: {
      type: String,
    },
  },
  setup(props) {
    const emitter = mitt();
    let error = ref();

    const validate = () => {
      // TODO：获取当前表单项的值进行校验
      // ？如何拿到表单项的值的呢
    };

    return { error, validate };
  },
};
</script>
<style scoped>
.errors {
  color: red;
  font-size: 12px;
}
</style>

```

## ti-form-item 组件校验方法

校验疑问：校验的过程其实就是规则和表单项的值进行匹配，但是`ti-form-item`组件又没有保存表单项的值，该怎么办呢？回想下在使用 ElementUI 的时候，我们并没有显示传递表单项的值，她是怎样做到呢，其实是通过 provide/inject 实现的。

在`ti-form`中定义一个响应式的表单对象，将 props、事件总线通过`provide`传递给子孙后代组件 ti-form-item，如`ti-input`、`ti-select`等具体的 UI 控件）

```js
// ti-form.vue文件
const tiForm = reactive({
  formEmitter: emitter,
  ...toRefs(props),
});
provide("tiForm", tiForm);
```

在子孙后代组件`ti-form-item`中通过`inject`接受

- 接受父组件`provide`提供的`formEmitter`、`model`、`rules`
- 将自身的`formItemEmitter`、`prop`、`rules`、 `validate`属性和方法，`provide`给子孙组件（`ti-input`、`ti-select`等 UI 控件）

```js
// ti-form-item.vue文件
<template>
  <div class="ti-form-item">
    <label for="">
      {{ label }}
    </label>
    <slot></slot>
    <p class="errors">
      {{ error }}
    </p>
  </div>
</template>
<script>
import Schema from "async-validator";
import mitt from "mitt";
import { reactive, onMounted, ref, toRefs, provide, inject } from "vue";
export default {
  setup(props) {
    const emitter = mitt();
    let error = ref();

    // 接受父组件传递的`formEmitter`、`model`、`rules`属性和方法
    const tiForm = inject("tiForm");

    const validate = () => {
      // 当前表单项校验
      // 获取校验规则和当前数据
      if (!props.prop) return;
      const rules = tiForm.rules[props.prop];
      const value = tiForm.model[props.prop];
      const validator = new Schema({ [props.prop]: rules });
      // 返回promise，全局可以统一处理
      return validator.validate({ [props.prop]: value }, (errors) => {
        // errors存在则校验失败
        if (errors) {
          error.value = errors[0].message;
        } else {
          // 校验通过
          error.value = "";
        }
      });
    };

    // 定义响应式的表单项对象，将props、校验方法、事件总线通过`provide`传递给子孙后代组件，如`ti-input`、`ti-select`等具体的UI控件
    const tiFormItem = reactive({
      ...toRefs(props),
      formItemEmitter: emitter,
      validate,
    });
    provide("tiFormItem", tiFormItem);

    return { error, validate };
  },
};
</script>

```

## ti-form 组件校验方法

表单项组件`ti-form-item`已基本实现校验，继续把目光放到 ti-form 组件，它也需要一个校验方法，用来在表单提交前校验所有的表单项`ti-form-item`，实现思路是：

- 接受一个回调函数

- 收集所有的子组件`ti-form-item`的`validate`并全部触发
- 将校验结果作为参数，传递给回调函数执行

```js
// ti-form.vue文件
const validate = (cb) => {
  const tasks = fields.map((item) => item.validate());
  Promise.all(tasks)
    .then(() => cb(true))
    .catch(() => {
      console.log("catch-false");
      cb(false);
    });
};
```

表单校验方法，用来在表单提交前校验，其实就是调用子组件`ti-form-item`的`validate`方法。其主要实现步骤：

- 父组件`ti-form`中通过事件总线注册一个方法收集所有子组件`ti-form-item`的`validate`方法
- provide/inject 将收集方法传递给子组件
- 子组件加载完成后，调用收集方法，将自身 validate 方法保存到父组件中

父组件`ti-form`：

```js
const fields = [];
emitter.on("ti.form.addField", (field) => {
  field && fields.push(field);
});

const validate = (cb) => {
  const tasks = fields.map((item) => item.validate());
  Promise.all(tasks)
    .then(() => cb(true))
    .catch(() => {
      console.log("catch-false");
      cb(false);
    });
};
```

子组件`ti-form-item`：

```js
onMounted(() => {
  // 注册validate事件， 用于UI控件触发校验, 如ti-input控件
  emitter.on("validate", validate);

  // 通过父组件的事件总线，将表单项校验方法传递给父组件
  if (props.prop) {
    tiForm.formEmitter.emit("ti.form.addField", tiFormItem);
  }
});
```

## ti-input 组件

input 组件功能较为简单，主要是两个功能点

- 实现 v-model
- blur 和 input 事件触发校验
- $attrs 普通属性的传递

与 vue2.x 相比 v-model 发生了一点点变化

- `value`改成了`modelValue`
- `input`事件改成了`update:modelValue`， 类似 v-bind:xxx.sync

```js
<template>
  <input type="text" :value="modelValue" @input="handleChange" @blur="handleBlur"/>
</template>
<script>
import { inject } from "vue";
export default {
  name: "ti-input",
  props: {
    modelValue: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const tiFormItem = inject("tiFormItem");

    const handleChange = (e) => {
      emit("update:modelValue", e.target.value);
      tiFormItem && tiFormItem.formItemEmitter.emit("validate");
    };

    const handleBlur = () => {
      tiFormItem && tiFormItem.formItemEmitter.emit("validate");
    };
    return { handleChange, handleBlur };
  },
};
</script>


```

测试效果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/157a69ce66cc48b490aa395d66db4b8a.gif#pic_center)

## 注册 Emitter 插件，实现全局事件触发与监听

在 ti-form 组件和 ti-form-item 组件我们都引入了 mitt 库，注册了自定义事件，并且都 provide 传递给了组件，这个过程我们可以进一步优化，实现一个 emitter 插件，在 app.config.globalPerperties 中进行声明，绑定到全局属性中。如此操作后在所有组件实例中就可以通过 proxy.$sub注册事件，proxy.$pub 触发事件。

新建/plugins/emitter.js

```js
import mitt from "mitt";

export default {
  install(app) {
    const _emitter = mitt();

    // 全局发布（在Vue全局方法中自定义$pub发布方法）
    app.config.globalProperties.$pub = (...args) => {
      _emitter.emit(args[0], args.slice(1));
    };

    // 全局订阅（在Vue全局方法中自定义$sub订阅方法）
    app.config.globalProperties.$sub = function (...args) {
      Reflect.apply(_emitter.on, _emitter, args);
    };

    // 取消订阅
    app.config.globalProperties.$unsub = function (...args) {
      Reflect.apply(_emitter.off, _emitter, args);
    };
  },
};
```

emitter 注册到 vue 实例上

```js
// 入口文件main.js
import { createApp } from "vue";
import App from "./App.vue";
import emitter from "./plugins/emitter";

const app = createApp(App);
app.use(emitter);
app.mount("#app");
```

修改`ti-form`中事件注册方式

```js
const { proxy } = getCurrentInstance();

proxy.$sub("ti.form.addField", (field) => {
  field && fields.push(field[0]);
});
```

修改`ti-form-item`事件触发与监听方式

```js
const { proxy } = getCurrentInstance();
onMounted(() => {
  // 注册validate事件， 用于UI控件触发校验, 如ti-input控件
  proxy.$sub("ti.form.item.validate", validate);

  // 通过父组件的事件总线，将表单项校验方法传递给父组件
  if (props.prop) {
    tiForm;
    proxy.$pub("ti.form.addField", tiFormItem);
    // tiForm.formEmitter.emit("ti.form.addField", tiFormItem);
  }
});
```

修改 ti-input 事件触发方式

```js
const { proxy } = getCurrentInstance();

const handleChange = (e) => {
  emit("update:modelValue", e.target.value);
  proxy.$pub("ti.form.item.validate");
};
```

全局修改完之后，效果和之前是一致的。

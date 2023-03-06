# 极简系列---vue2.x消息组件message

## 亿个小目标

实现一个小小目标---极简版的messge消息组件

- 支持多种调用方式
      1. 组件内`this.$message`方式调用
      2. 在`.js`文件中作为一个函数独立使用
- 支持手动关闭message



## 素材准备

素材准备：一个普通的`message.vue`单文件组件

- 接受两个参数：消息文本`message`、持续时间`duration`
- 两个方法：显示消息组件`show`、关闭消息组件`close`

```js
// message.vue
<template>
  <div class="message" v-if="isShow">
    <p>
      {{ message }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 3,
    },
  },
  data () {
    return {
      isShow: false,
    };
  },
  created () {
    this.show();
  },
  methods: {
    show () {
      this.isShow = true;
      setTimeout(() => {
        this.isShow = false;
      }, this.duration * 1000);
    },
    close () {
      this.isShow = false;
    },
  },
};
</script>

```

## 组件注册

要将一个vue组件动态的挂载到页面上，就必须先获取该组件的DOM。`Vue.extend`+`$mount`可以帮我们解决DOM获取问题，用法参考：https://cn.vuejs.org/v2/api/index.html#Vue-extend

新建一个`index.js`文件

```js
import Vue from "vue";
import Message from "./index.vue";

export const message = (props) => {
  // Vue.extend传递组件选项，返回一个组件构造函数
  const constructor = Vue.extend({
    render(h) {
      return h(Message, { props });
    },
  });
  const vm = new constructor().$mount();
  // 获取组件的DOM，将其挂载到body上
  document.body.appendChild(vm.$el);
};

```

在入口文件中，将messge方法挂载到Vue原型上后，所有的Vue组件内就能通过`this.$message`使用这个消息组件了

```js
import { message } from "./components/message";
Vue.prototype.$message = message;
```

继续完善这个组件，支持手动关闭消息组件。一个常见的方法是创建这个组件的同时返回这个组件实例，在这个实例上提供删除方法。

修改index.js文件

```js
import Vue from "vue";
import Message from "./index.vue";

export const message = (props) => {
  // Vue.extend传递组件选项，返回一个组件构造函数
  const constructor = Vue.extend({
    render(h) {
      return h(Message, { props });
    },
  });
  const vm = new constructor().$mount();
  // 获取组件的DOM，将其挂载到body上
  document.body.appendChild(vm.$el);
  
  // 创建这个组件的同时返回这个组件实例，在这个实例上提供删除方法。
  const comp = vm.$children[0];
  comp.remove = () => {
    document.body.remove(comp);
    vm.$destroy();
  };
  return comp;
};

```



完成代码参见：
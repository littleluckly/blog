# 极简系列---vue3.x消息组件message

> Vue2.x消息组件参考另一篇：[https://blog.csdn.net/hncu1990/article/details/119153572](https://blog.csdn.net/hncu1990/article/details/119153572)

## 全局API与vue2.x变化

| 变更前               | 变更后                                                       |
| -------------------- | :----------------------------------------------------------- |
| Vue.extend(组件选项) | Vue.createApp(组件选项)                                      |
| Vue.prototype        | config.globalProperties，<br />如`const app = createApp({})  app.config.globalProperties.$http = () => {}` |

## 一个小目标

实现一个小小目标---极简版的messge消息组件

- 支持多种调用方式

    1. 组件内`proxy.$message`方式调用

       ```js
       const { proxy } = getCurrentInstance();
       proxy.$message({
         message: "我是消息提示",
         duration: 2,
       });
       ```

    2. 在`.js`文件中作为一个函数独立使用
  ```js
  import { message } from "./components/message/index.js";
  message({
    message: "我是消息提示",
    duration: 2,
  });
  ```

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
    <button @click="close">关闭弹窗</button>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    message: {
      type: String, required: true,
    },
    duration: {
      type: Number, default: 3,
    },
  },
  setup(props) {
    let isShow = ref(false);
    const show = () => {
      isShow.value = true;
      setTimeout(() => {
        isShow.value = false;
      }, props.duration * 1000);
    };
    const close = () => {
      isShow.value = false;
    };
    return { isShow, show, close };
  },
  created() {
    this.show();
  },
};
</script>


```

## 组件注册

要将一个vue组件动态的挂载到页面上，就必须先获取该组件的DOM。
-  利用渲染函数`h`即`createVNode`，将`message.vue`组件编译成`vnode`，参见：[https://v3.cn.vuejs.org/guide/render-function.html#dom-%E6%A0%91](https://v3.cn.vuejs.org/guide/render-function.html#dom-%E6%A0%91)
-  利用`mount`将`vnode`挂载到指定元素上
-  通过`$el`获取真实DOM

新建一个`index.js`文件

```js
import { createApp, h } from "vue";
import Message from "./index.vue";

export const message = (props) => {
  const container = document.createElement("div");
  // 获取组件的DOM，将其挂载到body上
  const vm = createApp({
    render() {
      return h(Message, props);
    },
  });
  document.body.appendChild(vm.mount(container).$el);
  return {
    close: () => (vm.component.proxy.isShow = false),
  };
};

// 或者使用render方法，将vnode手动挂载到元素上
//import { h, render } from "vue";
//import Message from "./index.vue";

//export const message = (props) => {
//  const vm = h(Message, props);
//  const container = document.createElement("div");
//  render(vm, container);
//  // 获取组件的DOM，将其挂载到body上
//  document.body.appendChild(container.firstElementChild);
  
//  return {
//    close: () => (vm.component.proxy.isShow = false),
//  };
//};


```

在入口文件中，将messge方法挂载到Vue原型上后，所有的Vue组件内就能通过`proxy.$message`使用这个消息组件了

```js
import { message } from "./components/message";
const app = createApp(App);
app.config.globalProperties.$message = message;
```



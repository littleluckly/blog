## 事件通信方式

1. props

2. 自定义事件

3. 事件总线eventBus，

   1. 在挂在一个vue实例到prototype上，vue.prototype.$bus=new Vue(), 使用$on注册事件, $emit触发事件。
   2. 自己实现一个简单的事件总线，实现订阅发布

   ```js
   class Bus {
     constructor(){
       this.callbacks = {}
     }
     $on(name, fn){
       this.callbacks[name] = this.callbacks[name]||[]
       this.callbacks[name].push(fn)
     }
     $emit(name, args){
       if(this.callbacks[name]){
         this.callbacks.forEach(cb=>cb(args))
       }
     }
   }
   
   Vue.prototype.$bus = new Bus()
   ```

   

   

4. $parent/$root

5. $children

6. $attrs/$listeners

   $attrs: 指的是父组件上的普通属性，未props声明的属性，如class,  style

   $listeners: 指的是父组件上定义的所有方法

7. provide/inject  跨层传第参数

   父组件提供provide

   ```js
   // 父组件
   provide(){
     return {foo: 'aaa'} // 这里返回的数据会被子组件的inject接受
   }
   
   // 子组件, 接受的数据不是响应式，但是可以传递一个object进来，同样可是实现响应式
   inject: ['foo']
   inject: {
     foo: 'fooAlias'
   }
   inject: {
     fooAlias: {
       from: 'foo',
         default: 'aaaaa'
     }
   }
   ```



## 插槽

匿名插槽

具名插槽

作用域插槽



## 组件化实战---通用表单组件

需求分析：

- 实现ti-form
  - 指定数据model、校验规则
  - 校验方法validate()
- Ti-form-item
  - label标签
  - prop属性名称
  - 执行校验validate
  - 显示错误信息
- 表单项组件
  - 维护数据v-model
  - 图标、反馈







```vue
<template>
  <div>
    <input :type="type" :value="value" @input="onInput">
  </div>
</template>

<script>
export default {
  props:{
    type:{
      type: String,
      default: 'text'
    },
    value:{
      type: String,
      default: ''
    }
  },
  methods:{
    onInput(e){
      this.$emit('input',e.target.value)
    }
  }

}
</script>

<style>

</style>
```


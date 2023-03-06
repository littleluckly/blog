> v-if和v-for哪个优先级更高

- v-for优先级更高
- 如果同时出现，每次渲染都会先执行循环，再判断，浪费了性能
- 避免这种情况出现应该可以再套一层template做判断，内部for循环
- 也可以做层计算属性，先把要循环的数据做一层过滤，再去循环



> vue组件data为什么必须是一个函数，而Vue的根实例没有此限制

函数可以保证组件多实例不会相互污染

根实例只创建一次



> vue中key的作用和工作原理

- key的主要作用是为了高效更新虚拟dom，其原理是vue再patch过程中通过key可以精准判断两个节点是否是同一个，从而避免频繁更新不同元素，使得这个那个patch过程更加高效，减少dom操作量，提高性能
- 不设置key可能会在列表更新时引发一些隐蔽的bug
- 



> 怎么理解vue中的diff算法



> 怎样理解vue的组件化

- 组件是独立和可复用的代码组织单元，组件系统是vue的核心特性之一
- 组件化开发能大幅提高应用的开发效率，测试行，复用性
- 按照使用分类有：页面组件/业务组件/通用组件
- vue常见的组件化技术：属性prop， 自定义事件，插槽
- 遵循单向数据流的原则



> mvvm框架的理解

![image-20210703203238834](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210703203238834.png)

view视图层

model数据模型

viewModel 一套数据响应式机制，能够自动响应model中数据变化，自动更新视图。

通过事件的监听响应view中用户交互，修改model数据

viewModel可以减少大量的dom操作代码

用户可一专注于业务逻辑，提高开发效率



> Vue中的性能优化方法

- 路由懒加载
- keep-alive缓存页面
- v-show复用DOM
- 长列表虚拟滚动加载
- 事件及时销毁，定时器及时销毁
- 图片懒加载 

参考`vue-lazyload`

- 第三方插件按需引入

- 无状态组件标记为函数式组件

- 利用计算属性缓存



> Vue3的新特性

- proxy重写响应式系统
- componsition Api 类似react hooks
- 独立的响应式模块
- 更好的ts支持
- 速度更快，虚拟DOM重写
- 更好的调试支持



> Vue响应式原理

vue2.x

```js
function defineReactive(obj,key,val){
  Object.defineProperty(obj,key, {
    enumerable:true,
    get(){
      console.log('get',val)
      return val
    },
    set(newVal){
      if(newVal!==val){
      console.log('set',newVal)
        val = newVal
      }
    }
  })
}
```


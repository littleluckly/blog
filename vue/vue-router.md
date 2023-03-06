# vue-router



## 需求分析

- Vue.use注册插件
- $router实例
- 全局组件router-view、router-link

- 页面路由发生变化，页面不刷新，内容更新

  设置一个响应式url，在render函数中加载路由对应的内容



## 实现插件

VueRouter类，提供install方法

```js
let KVue;

class KVueRouter {
  constructor($options) {
    this.$options = $options;

    const initial = window.location.hash.slice(1) || "/";
    KVue.util.defineReactive(this, "current", initial);

    window.addEventListener("hashchange", this.onHashChange.bind(this));
    window.addEventListener("load", this.onHashChange.bind(this));

    // 缓存路由文件
    this.routerMap = {};
    $options.routes.reduce((acc, route) => {
      acc[route.path] = route;
      return acc;
    }, this.routerMap);
  }

  onHashChange() {
    this.current = window.location.hash.slice(1);
    console.log(this.current);
  }
}

KVueRouter.install = function (Vue) {
  KVue = Vue;

  // Vue上挂载实例$router
  // 注意⚠️，普通情况下还没有进行实例化，如何才能拿到这个实例
  // 可以利用全局混入mixin，在beforeCreate中拿到router实例
  // 注意全局混入时，会在每个组件中执行，要判断只在根组件中挂载一次即可

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    },
  });

  // 注册全局组件router-view router-link
  Vue.component("router-view", {
    render(h) {
      const current = this.$router.current;
      const comp = this.$router.routerMap[current]
        ? this.$router.routerMap[current].component
        : null;
      if (comp) {
        return h(comp);
      }
      return h("div", "view");
    },
  });
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        default: "",
      },
    },
    render(h) {
      return h(
        "a",
        {
          attrs: {
            href: "#" + this.to,
          },
        },
        this.$slots.default
      );
    },
  });
};

export default KVueRouter;

```






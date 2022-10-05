>  参考资料《JavaScript高级程序设计》
>
>  Object.create: [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
>
>  Es6 class : [http://caibaojian.com/es6/class.html](http://caibaojian.com/es6/class.html)

本文介绍四种实现继承的方式
1. 原型链继承
2. 组合继承
3. 寄生式组合继承
4. es6 class继承

## 原型链继承

实现一个简单的原型链继承，三步走：

- 定义父类构造函数Parent，设置name属性和getName方法
- 定义子类构造函数Person，将其prototype指向父类实例，继承父类的属性和方法
- 创建子类构造函数的实例，通过prototype访问父类Person的getName方法

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  return this.name;
};

function Child() {}
Child.prototype = new Parent("hanmeimei");

const person = new Child();
console.log(person.getName()); // 输出：hanmeimei
```

可以看到，子类构造函数的实例，能够访问到父类构造函数的属性和方法，成功的在控制台打印出`hanmeimei`。

但是这种继承方式存在如下缺陷：

1. 子类实例化的时候不能自由传参，只能在设置子类构造函数的原型的时候传参一次`Child.prototype = new Parent("hanmeimei");`
2. 父类的属性值是引用类型，则所有子类实例会共享，如

```js
// ...省去其他代码
Child.prototype = new Parent(["hanmeimei"]);
// ...省去其他代码

const p1 = new Child();
const p2 = new Child();
p1.name.push("lilei");
console.log(p2.getName()); // 输出[ 'hanmeimei', 'lilei' ]
```



## 组合继承：借用call/apply实现继承+原型链

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  return this.name;
};

function Child(name) {
  Parent.call(this, name);
}
Child.prototype = new Parent();

```

创建实例验证效果

```js
const p1 = new Child(["hanmeimei"]);
const p2 = new Child(["lilei"]);
p1.name.push("lilei");
console.log(p1.getName()); // 输出[ 'hanmeimei', 'lilei' ]
console.log(p2.getName()); // 输出[ 'lilei' ]
```

优点：

1. 可以传参
2. 引用类型属性不会共享

缺陷：

组合继承的方式比较完善，但仍然有瑕疵，就是两次调用了父类构造函数`Child.prototype = new Parent()`和`Parent.call(this, name)`，导致实例和Child.prototype上都创建了一个name属性。

可以通过`getOwnPropertyNames`查看

```js
console.log(Object.getOwnPropertyNames(Child.prototype)); // 输出：[ 'name' ]
console.log(Object.getOwnPropertyNames(p1)); // 输出：[ 'name' ]
```

《JavaScript高级程序设计》上还介绍了一种寄生式组合继承方法，可以解决这个缺陷



### 寄生式组合继承

关键是借助`Object.create`创建一个新对象，用来指定这个新对象的原型，参考：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

也可以自己模拟一个`Object.create`

```js
function createObj(obj) {
  const F = function () {};
  F.prototype = obj;
  return new F();
}
```

利用这个改写组合继承子类构造函数继承写法

```js
// Child.prototype = new Parent();  原来的写法
Child.prototype = createObj(Parent.prototype);  //新写法
// 或者
Child.prototype = Object.create(Parent.prototype);  //新写法
```

最终的完整代码如下：

```js
function createObj(obj) {
  const F = function () {};
  F.prototype = obj;
  return new F();
}

function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  return this.name;
};

function Child(name) {
  Parent.call(this, name);
}
Child.prototype = createObj(Parent.prototype);
```

写一段测试代码验证：

```js
const p1 = new Child(["hanmeimei"]);
console.log(p1.getName()); // 输出：[ 'lilei' ]
console.log(Object.getOwnPropertyNames(Child.prototype)); // 输出：[]
console.log(Object.getOwnPropertyNames(p1)); // 输出：[ 'name' ]
```

既有组合继承的优点，也去掉了Child.prototype上的name属性



## ES6 class继承

参考文档：[http://caibaojian.com/es6/class.html](http://caibaojian.com/es6/class.html)

实现继承最简单的方式莫过于使用es6语法class

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
class Child extends Person {
  constructor(name) {
    super(name);
  }
}
```

创建实例验证效果

```js
const p1 = new Child(["hanmeimei"]);
const p2 = new Child(["lilei"]);
p1.name.push("lilei");
console.log(p1.getName()); // 输出[ 'hanmeimei', 'lilei' ]
console.log(p2.getName()); // 输出[ 'lilei' ]
```

ES6的类class，完全可以看作构造函数的另一种写法。

```js
typeof Point // "function"
Point === Point.prototype.constructor // true
```


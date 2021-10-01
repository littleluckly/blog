export = {};
namespace a {
  function addNameEat(x: Function) {
    x.prototype.name = "hello decorator";
    x.prototype.eat = function () { };
  }
  // 类装饰器   缺点没有办法传参
  @addNameEat
  class Person {
    name!: string;
    eat!: Function;
    constructor() { }
  }
  const p: Person = new Person();
  p.name;
  p.eat;
}

namespace b {
  // 类装饰器工厂   可以传参
  function addNameEatFactory(name: string) {
    return function (x: Function) {
      x.prototype.name = name;
      x.prototype.eat = function () { };
    };
  }
  @addNameEatFactory("hello too")
  class Person {
    name!: string;
    eat!: Function;
    constructor() { }
  }
  const p: Person = new Person();
  console.log(p.name);

  p.eat();
}

// 装饰器  替换类
namespace c {
  function replaceClass(constructor: Function) {
    return class {
      name: string = 'hello replaceClass';
      eat: Function = function () { }
      age: number = 0;
      constructor() { }
    }
  }

  @replaceClass
  class Person {
    name!: string;
    eat!: Function;
    constructor() { }
  }
  const p = new Person()
  console.log(p.name);

}


// 属性装饰器：静态属性装饰器、实例属性装饰器
namespace d {
  /**
   * @param target 如果装饰实例属性，target是构造函数原型对象
   * @param propertyKey 装饰的属性
   */
  function upperCase(target: any, propertyKey: string) {
    let value = target[propertyKey]

    if (Reflect.deleteProperty(target, propertyKey)) {
      Object.defineProperty(target, propertyKey, {
        get: () => value,
        set: (newValue: string) => value = newValue.toUpperCase(),
        enumerable: true,
        configurable: true
      })
    }
  }
  // 如果装饰实例属性/方法，target是构造函数本身
  function staticDecorator(target: any, propertyKey: string) {
    console.log(target, propertyKey, target[propertyKey]);
  }
  class Person {
    // 装饰实例属性
    @upperCase
    public name: string = "hello property"
    // 装饰静态属性
    @staticDecorator
    static age: number = 18
    // 
    getName() {
      return this.name
    }
  }
  const p = new Person()
  console.log(p.getName());

}

// 参数装饰器
namespace e {
  // 参数所属方法是静态成员，则target是构造函数；非静态成员，则target是构造函数的原型对象
  function age(target: any, methodName: string, parentIndex: number) {

    target.age = 12
  }
  class Person {
    age!: number;
    login(name: string, @age pwd: string) {

    }
  }
  const p = new Person()
  console.log(p.age);

}

// 多个不同类型的装饰器执行顺序
// 由内往外执行
// 类装饰器最后执行
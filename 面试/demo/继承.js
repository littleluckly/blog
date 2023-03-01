// js继承的方式
// 方式一： 原型链继承
// function Parent(name) {
//   this.name = name;
// }
// Parent.prototype.getName = function () {
//   return this.name;
// };

// function Child() {}
// Child.prototype = new Parent(["hanmeimei"]);

// const p1 = new Child();
// const p2 = new Child();
// p1.name.push("lilei");
// console.log(p2.getName());

// 方式二：经典继承（借用call/apply)
// function Parent(name) {
//   this.name = name;
// }
// Parent.prototype.getName = function () {
//   return this.name;
// };

// function Child(name) {
//   Parent.call(this, name);
// }
// Child.prototype = new Parent();

// const p1 = new Child(["hanmeimei"]);
// const p2 = new Child(["lilei"]);
// p1.name.push("lilei");
// console.log(p1.getName());
// console.log(p2.getName());
// console.log(Object.getOwnPropertyNames(Child.prototype));
// console.log(Object.getOwnPropertyNames(p1));

// 方法三：寄生式组合继承
// function createObj(obj) {
//   const F = function () {};
//   F.prototype = obj;
//   return new F();
// }

// function Parent(name) {
//   this.name = name;
// }
// Parent.prototype.getName = function () {
//   return this.name;
// };

// function Child(name) {
//   Parent.call(this, name);
// }
// Child.prototype = Object.create(Parent.prototype);

// const p1 = new Child(["hanmeimei"]);
// const p2 = new Child(["lilei"]);
// p1.name.push("lilei");
// console.log(p1.getName());
// console.log(p2.getName());
// console.log(Object.getOwnPropertyNames(Child.prototype));
// console.log(Object.getOwnPropertyNames(p1));

// 方法四
// es6 class
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
const p1 = new Child(["hanmeimei"]);
const p2 = new Child(["lilei"]);
p1.name.push("lilei");
console.log(p1.getName());
console.log(p2.getName());
console.log(Object.getOwnPropertyNames(Child.prototype));
console.log(Object.getOwnPropertyNames(p1));

// class MyDate extends Date {
//   getTime() {
//     return this.getTime();
//   }
// }
// let myDate = new MyDate();
// console.log(myDate.getTime());

export { }

// 抽象类
// 只能被继承，不能实例
// 继承的子类必须实现抽象类中的方法
abstract class Animal {
  name: string | undefined;
  abstract speak(): void
}
class Cat extends Animal {
  speak(): void {
    console.log('喵喵喵');
  }
}
const cat = new Cat()
cat.speak()

// 接口interface
interface Speakable {
  name: string;
  speak(): void;
}
const speakMan: Speakable = {
  name: 'hello interface',
  speak() {
    console.log('哈哈哈');
  }
}
speakMan.speak()

// 多个同名接口会自动合并
interface Speakable {
  name: string;
  speak(): void;
}
interface Eatable {
  eat(): void;
}
// 接口实现implements
class Person implements Speakable, Eatable {
  name!: string;
  speak(): void {
    console.log('speak');

  }
  eat(): void {
    console.log('eat');
  }
}
const p = new Person()
p.speak()
p.eat()

// 接口继承
interface Speakable2 {
  speak(): void;
}
interface SepakChinese extends Speakable2 {
  speakChinese(): void
}
class ChineseMan implements SepakChinese {
  speakChinese(): void {
    throw new Error("Method not implemented.");
  }
  speak(): void {
    throw new Error("Method not implemented.");
  }
}


// 接口属性的任意类型、只读属性
interface Person2 {
  readonly id: number;
  name: string;
  [key: string]: any
}
const p2: Person2 = {
  id: 0,
  name: 'hhhh',
  age: 12,
  11: 123
}

// 函数类型的接口
interface Discount {
  (price: number): number
}
const d: Discount = (price: number): number => price * 0.8


// 构造函数类型接口
// 在普通函数类型接口前加一个new
interface Discount2 {
  new(price: number): any;
}
const createClass = (clazz: Discount2, price: number) => {
  return new clazz(price)
}
class DiscountConstructor { }
const d2 = createClass(DiscountConstructor, 12)

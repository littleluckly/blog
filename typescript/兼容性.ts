export = {}

// 接口的兼容性
interface Animal {
  name: string;
  age: number;
}
interface Person {
  name: string;
  age: number;
  gender: string
}

const getName = (a: Animal): string => {
  return a.name
}
const a: Animal = {
  name: '大猩猩',
  age: 12
}
const p: Person = {
  name: '张三',
  age: 18,
  gender: '男'
}
// Animal和Person接口类型兼容，因为接口Animal的描述都在接口Person中存在
getName(a)
getName(p)


// 类的兼容性
namespace ab {
  class Animal {
    name!: string
  }
  class Bird extends Animal {
    age!: number
  }
  let a: Animal = new Animal();
  let b: Bird = new Bird();
  a = b
  // b = a // 报错

}

// 函数的兼容性 - 函数参数的兼容性
// interface Func {
//   (a: number, b: number): void
// }
type Func = (a: number, b: number) => void
let fn: Func;
const f1 = (a: number, b: number) => { }
fn = f1
// 缺少部分参数 ok
const f2 = (a: number) => { }
fn = f2
// 缺少全部参数 ok
const f3 = () => { }
fn = f3
// 多一个参数  不行
const f4 = (a: number, b: number, c: number) => { }
// fn = f4 // 报错


// 函数的兼容性 - 函数返回值的兼容性
type GetPerson = () => { name: string, age: number }
let getPerson: GetPerson;
const g1 = () => ({
  name: 'name1',
  age: 12
})
getPerson = g1 // ok
const g2 = () => ({
  name: 'name1',
})
// getPerson = g2 // 报错：缺少一个属性
const g3 = () => ({
  name: 'name1',
  age: 12,
  gender: 'man'
})
getPerson = g3 // 多一个属性，ok


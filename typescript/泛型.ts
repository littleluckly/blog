export = {}
/* 
知识点：
泛型基础
泛型函数
默认泛型
泛型类
泛型与new(构造函数，类) 
多个泛型同时作用
泛型约束---重点
类型别名
*/


// 泛型，宽泛的类型

// 泛型函数：
function createArray(length: number, value: any): Array<any> {
  return Array.from({ length }).fill(value)
}
// 上面方法是生成一个指定长度，指定内容的数组
// 指定的内容value在方法调用的时候就已经确定，name函数返回值类型也确定了
// 此种场景可以引用泛型概念
function createArray2<T>(length: number, value: T): Array<T> {
  return (Array.from({ length }) as T[]).fill(value)
}
console.log(createArray2<string>(3, 'x'))
// 默认泛型：不指定类型
console.log(createArray2(3, 112233));


// 泛型类
class MyArray<T> {
  private list: T[] = [];

  add(value: T) {
    this.list.push(value)
  }

  getFirst(): T {
    return this.list[0]
  }
  getList(): T[] {
    return this.list
  }
}
const arr = new MyArray<number>()
arr.add(1)
arr.add(2)
console.log(arr.getList())


// 泛型与new(构造函数，类)
function factory<T>(constructor: { new(): T }): T {
  return new constructor()
}
class Person {

}
const p = factory<Person>(Person)


// 泛型接口
interface Calculate {
  <T>(a: T, b: T): T
}
const sum: Calculate = function <T>(a: T, b: T): T {
  // return a+b  // 报错，不能在泛型T上使用符号+
  return a
}
console.log(sum<number>(1, 2));
// 泛型接口的另一种形式 
interface Calculate2<T> {
  (a: T, b: T): T
}
const sum2: Calculate2<number> = function (a: number, b: number): number {
  return a + b
}



// 多个泛型同时作用
function swap<A, B>(tuple: [A, B]): [B, A] {
  return [tuple[1], tuple[0]]
}






// 泛型约束
function logger1<T>(val: T) {
  // console.log(val.length); // 报错，val是任意类型，不是每个类型都有length属性
}
interface LengthWise {
  length: number
}
function logger2<T extends LengthWise>(val: T) {
  console.log(val.length);
}
logger2('泛型约束')
// logger2(1234)  // 报错，1234没有length属性

const obj = {
  length: 10
}
// type Obj = typeof obj   // 通过typeof获取一个已知变量的类型
// 等同于下面这种写法
type Obj = {
  length: number
}
logger2<Obj>(obj)

// 泛型约束指定类型
interface Calculate3 {
  <T extends (string | number)>(a: T, b: T): void
}
const sum3: Calculate3 = function <T extends (string | number)>(a: T, b: T): void { }
// const sum4: Calculate3 = function <number>(a: number, b: number): void { } // 写法错误
sum3(1, 2)
sum3('1', '2')


// 泛型类型别名
type Cart<T> = { list: T[] } | T[]
const c1: Cart<string> = { list: ['1', '2', '3'] }
const c2: Cart<number> = [1, 2, 3]


function compose(...funcs: Function[]) {
  return funcs.reduce((a, b) => (...args: any) => a(b(...args)))
}
const add1 = (str: string) => str + 1
const add2 = (str: string) => str + 2
const add3 = (str: string) => str + 3
console.log(compose(add1, add2, add3)('compose'));

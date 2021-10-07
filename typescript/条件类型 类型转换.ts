export = {}

interface Fish {
  name1: string
}
interface Water {
  name2: string
}

interface Bird {
  name3: string
}
interface Sky {
  name4: string
}

// 根据条件动态判断
type Condition<T> = T extends Fish ? Water : Sky
let con1: Condition<Fish> = { name2: '水' }
let con2: Condition<Bird> = { name4: '天空' }

// 条件内容分发
let con3: Condition<Fish | Bird> = { name4: '', name2: '' }


// 找出T中不包含U的部分
type Diff<T, U> = T extends U ? never : T
type R = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'> // type R = 'd'
// 等同于
type R2 = never | never | never | 'd'

// 找出T中包含U的部分
type Filter<T, U> = T extends U ? T : never
type R3 = Filter<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'> // type R = 'a' | 'b' | 'c'



// 内置条件类型---Exclude
// 效果等同于上面的Diff
type R4 = Exclude<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>

// 内置条件类型---Extract
// 效果等同于上面的Filter
type R5 = Extract<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>

// 内置条件类型
type R6 = NonNullable<'a' | null | undefined> // type R6 = 'a'
// 约等于
type MyNonNullable<T> = T extends null | undefined ? never : T
type R7 = MyNonNullable<'a' | null | undefined> // type R7 = 'a'


// 内置条件类型---ReturnType
// 获取函数返回值的类型
function getUser(name: string, age: number) {
  return { name: 'hello ReturnType', age: 12 };
}
// type GetUserType = typeof getUser
type GetUserReturnType = ReturnType<typeof getUser>
const re: GetUserReturnType = { name: '', age: 12 }



// 内置条件类型---Parameters
// 获取函数参数类型，返回的是元组类型
type GetUserParamsType = Parameters<typeof getUser>
const pa: GetUserParamsType = ['aa', 123]


// 内置条件类型---Parameters
// 获取类的构造函数的参数类型，返回的是元组类型
class Person {
  constructor(public name: string) {
    this.name = name
  }
  getName() {
    return this.name
  }
}
type ConsPa = ConstructorParameters<typeof Person>
const pa2: ConsPa = ['I am ConstructorParameters']


// 内置条件类型---InstanceType
// 获取类的实例类型
type PerIns = InstanceType<typeof Person>
const perins: PerIns = { name: 'i am InstanceType', getName() { return 'i am InstanceType' } }



// infer(推断)
// 应用实例
// 将元组类型tuple转联合类型union  [string,number] ==> string|number
type TupleToUnion<T> = T extends Array<infer E> ? E : never // 此处infer E用来推断元组的每一项的类型，并声明一个变量E
type Tuple1 = [string, number]
type Union1 = TupleToUnion<Tuple1>
const a: Union1 = '123'
const b: Union1 = 123


// 联合类型转交叉类型
type T1 = { name: string }
type T2 = { age: number }
type ToIntersection<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never
type Intersection1 = ToIntersection<{ a: (x: T1) => void, b: (x: T2) => void }>
// 效果等同于 type Intersection1 = T1 & T2 
const int1: Intersection1 = { name: '123', age: 12 }


/* Record记录类型 */
// 需求：实现一个mapObject方法，传入一个对象obj,方法map, 对该对象每一项值调用map方法处理
// 极简版： 
// function mapObject(obj: object, map: Function) {
//   const result: any = {} 
//   for (let key in obj) {
//     result[key] = map(obj[key])
//   }
//   return result
// }
// 记录一个对象的key, value
// type Record<K extends keyof any, T> = {
//   [P in K]: T;
// };
function mapObject<K extends string | number, VAL, RES>(obj: Record<K, VAL>, map: (x: VAL) => RES) {
  const result: Record<K, RES> = <Record<K, RES>>{}
  for (let key in obj) {
    result[key] = map(obj[key])
  }
  return result
}
const fn = (x: number): string => x * 2 + ''
const obj = mapObject({ a: 1, b: 2 }, fn)
console.log(obj)
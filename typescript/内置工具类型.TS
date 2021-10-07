export { }
interface A {
  a: string,
  b: number
}
const a: A = {
  a: '',
  b: 1
}
/* 必选项转成必选项---Partial */
// 借助工具类型Partial，将接口A属性变成可选
type PartialA = Partial<A>
// 相当于
// interface A {
//   a?: string,
//   b?: number
// }
const pa: PartialA = {}

// 实现一个自己的Partial
type Partial1<T> = {
  [P in keyof T]?: T[P]
}

// 递归Pratial  --- DeepPratial
// 延伸知识object也是ts的一个类型  const obj:object={}
type DeepPratial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPratial<T[P]> : T[P]
}
interface Company {
  id: number
  name: string
}
interface Person {
  id: number
  name: string,
  company: Company
}
type PersonPartial = DeepPratial<Person>
const p1: PersonPartial = {
  id: 1,
  name: '123',
  company: {} // 通过DeepPartial，把company类型属性变成可选
}


/* 可选项转必选项---required */
namespace a2 {
  type Person = {
    name: string,
    age?: number
  }
  type RequiredPerson = Required<Person>
  const p1: RequiredPerson = {
    name: '',
    age: 12
  }
  // 实现一个自己的Required
  type MyRequired<T> = {
    [P in keyof T]-?: T[P]
  }
}

/* 类型属性转只读属性---Readonly */
namespace a2 {
  type Person = {
    name: string,
    age?: number
  }
  type ReadonlyPerson = Readonly<Person>
  const p: ReadonlyPerson = { name: '1', age: 10 }
  // p.age = 10 // 提示错误，只读属性

  type MyReadonly<T> = {
    readonly [P in keyof T]: T[P]
  }
}

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
// 测试 
type Test1 = {
  name: string;
  age: number;
}
type Test1_1 = MyPick<Test1, 'name'>// {name:string}
type Test1_2 = Pick<Test1, 'name'>// {name:string}

type MyExclude<T, U> = T extends U ? never : T;
// 测试
type Foo3 = {
  name: string;
  age: number;
}
type ExFoo3 = MyPick<Foo3, MyExclude<keyof Foo3, 'age'>> // {name:string}
type ExFoo3_1 = Pick<Foo3, Exclude<keyof Foo3, 'age'>> // {name:string}

type MyExtract<T, U> = T extends U ? U : never;
// 测试 
type Test2_1 = MyPick<Test1, MyExtract<keyof Test1, 'name'>>// {name:string}
type Test2_2 = Pick<Test1, Extract<keyof Test1, 'name'>>// {name:string}

type MyParamers<F> = F extends (...args: infer P) => any ? P : never;
type MyReturn<F> = F extends (...args: any) => infer R ? R : never;
type MyNonNullable<T> = T extends undefined | null ? never : T


type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

interface Person1 {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person1>;
// {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
interface User1 {
  id: number;
  name: string;
  age: number;
  updateName(newName: string): void;
}
type T5 = FunctionPropertyNames<User1>; // "updateName"
const a1: string = null
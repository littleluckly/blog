interface A {
  name: string;
  c: number;
}
interface B {
  age: number;
  c: number;
}
type C = A & B
const c: C = { name: '两个对象类型的交叉类型取的是并集', age: 12, c: 22 }

type AA = string | number;
type BB = string | boolean;
type CC = AA & BB;
// 两个联合类型交叉取的是交集
const c2: CC = '两个类型交叉取的是交集'
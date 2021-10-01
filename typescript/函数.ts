function hello(name: string): void {
  console.log('hello ', name)
}
hello('zhangsan')


type Getname = (firstname: string, lastname: string) => string
const getName: Getname = function (firstname: string, lastname: string): string {
  return firstname + lastname
}

function sum(...numbers: Array<number>): number {
  return numbers.reduce((val, item) => val + item, 0)
}
console.log(sum(1, 2, 3));

// 函数重载
// 利用函数重载实现add方法，传入两个参数，要求都为string或者都为number
function add(a: string, b: string): void
function add(a: number, b: number): void
function add(a: string | number, b: string | number): void {
}
add('1', '2')
add(1, 2)
// add(1,'2')// 报错
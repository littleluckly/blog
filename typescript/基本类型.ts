let astring: string = 'astring'
let anumber: number = 123
let aboolean: boolean = true

// 数组两种写法
let arr1: number[] = [1, 2, 3]
let arr2: Array<number> = [4, 5, 6]

// 元组类型tuple：有限制的,已知的数量和类型的数组
let arr3: [string, number] = ['typescript', 100]
console.log(arr3);


// 枚举类型
// 普通枚举
enum Gender {
  GIRL,
  BOY
}
console.log(Gender[0], Gender.GIRL); // GIRL 0
// 常量枚举
const enum Colors {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue'
}
console.log(Colors.RED, Colors.GREEN, Colors.BLUE)

// 任意类型
// any

// 联合类型
let mul: number | string
mul = 123
mul = '123'

// undefined null是其他类型的子类型，可以将他们赋值给其他类型
let x: number
// 如果tsconfig.json开启了严格配置strict:true，则不能将undefined null赋值给其他类型
// x=undefined

// 非空断言
let element: HTMLElement | null = document.querySelector('#root') // document需要配置tsconfig.json字段lib: ["ESNext"]
// 下面这个语句会提示错误，硬卧element可能位null
// element.style.color='red'
// 使用!非空断言，告诉ts，element肯定存在

// Symbol
// 一般情况下Symbol不能使用，需要配置tsconfig.json的lib字段  lib: ["ESNext"]
const key1 = Symbol('k')

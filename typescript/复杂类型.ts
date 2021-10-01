// 类型推导
let s = '234' // 不指定类型赋值，ts会自动推导出类型
// s=123  // 报错

// 包装对象 wrapper object
let s2 = 'name'
s2.toUpperCase()  // js内部会将s2包装程对象类型new String(s2).toUpperCase()

// 联合类型
let s3: number | string
s3 = '123'
s3 = 234


// 类型断言 as
let s4: number | string;
(s4! as number).toFixed(2)

// 双重断言
// s4! as boolean // 报错
s4! as any as boolean  // 正常

// 字面量类型
const up: 'Up' = 'Up'
// 字面量类型可以实现枚举效果，  和联合类型有点类似
type Direction = 'Up' | 'Down' | 'Left' | 'Right';

function move(direction: Direction): void {
  console.log(direction);

}
// move("a") // 报错，只能传入'Up'|'Down'|'Left'|'Right'

// 类型字面量
type Person = {
  name: string,
  year: number
}
const p1: Person = {
  name: 'zhangsan',
  year: 18
}

// 字面量类型和联合类型的区别
type T1 = '1' | '2' | '3'
type T2 = string | number | boolean
// const t1:T1 = '0'  // 报错，只能取字符串的1、2、3
const t2: T2 = '2'
const t3: T2 = 2354
const t4: T2 = true
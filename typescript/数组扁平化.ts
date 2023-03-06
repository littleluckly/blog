type NaiveFlat<T extends any[]> = { [K in keyof T]: T[K] extends any[] ? T[K][number] : T[K] }[number]


// 测试用例：
type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>
// NaiveResult的结果： "a" | "b" | "c" | "d"

// 深层扁平化
type DeepFlat<T extends any[]> = {
  [K in keyof T]: T[K] extends any[] ? DeepFlat<T[K]> : T[K]
}[number]
type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]];
type DeepTestResult = DeepFlat<Deep>

type SomeType = {
  prop: string
}

// 更改以下函数的类型定义，让它的参数只允许严格SomeType类型的值
function takeSomeTypeOnly(x: SomeType) { return x }

// 测试用例：
const x = { prop: 'a' };
takeSomeTypeOnly(x) // 可以正常调用

const y = { prop: 'a', addditionalProp: 'x', name: 'sldkj', age: 12, b: false };
takeSomeTypeOnly(y) // 将出现编译错误

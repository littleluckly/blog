// 泛型，宽泛的类型
function createArray(length: number, value: any): Array<any> {
  return Array.from({ length }).fill(value)
}
// 上面方法是生成一个指定长度，指定内容的数组
// 指定的内容value在方法调用的时候就已经确定，name函数返回值类型也确定了
// 此种场景可以引用泛型概念
function createArray2<T>(length: number, value: T): Array<T> {
  return (Array.from({ length }) as T[]).fill(value)
}
console.log(createArray2(3, 'x'))

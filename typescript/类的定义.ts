// 如下书写方式报错，提示标识符重复，因为在另一个文件【复杂类型.ts】中定义了一个类型字面量Person
// 疑问：不同文件下定义的类型，为什么提示标识符重复呢
// 解答：默认是全局的，可以通过export关键字将其模块化，将类型编程一个局部的
// class Person{
//   name: string=''
//   getName():string{
//     return this.name
//   }
// }

// 没问题
// export = {}
// class Person{
//   name: string=''
// }
// const p1 = new Person()

// 类的修饰符 public protected private
// public
// class User {
//   constructor(public name:string){
//     // 不加public报错, 加了public后会自动将name属性添加到实例属性上
//     this.name=name
//   }
// }
// 上面的写法等同于
class User {
  public name:string  // 默认是public 也可以省略不写
  constructor(name:string){
    this.name=name
  }
} 

// 类属性：readonly只读属性, 只能在constructor中赋值一次
class Animal {
  public readonly name:string // 默认是public 也可以省略不写
  constructor(name:string){
    this.name=name
  }
  changeName(name:string){
    // 报错，不允许对readonly属性修改
    // this.name=name
  }
}


// protected 
class Father {
  public name:string  // 父类、子类、实例均能访问
  protected year:number // 父类，子类能访问，实例不能访问
  private money:number=123 // 仅父类自己可以访问
  constructor(name:string,year:number){
    this.name=name
    this.year = year
  }
}
class Child extends Father {
  constructor (name:string, year:number, public childName:string){
    super(name,year)
    this.childName=childName
  }
  getFatherName():string{
    return this.name
  }
}
const p2 = new Child('father',60, 'child')
p2.name // 子类实例可访问父类的public属性
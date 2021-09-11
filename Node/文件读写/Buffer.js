// node中可以通过Buffer操作二进制数据

// 声明方式
// 1.固定长度
let buffer;
buffer = Buffer.alloc(12); // 表示声明一个12字节的内存空间，即12*8位
console.log(buffer); // 返回的buffer对象用16进制表示  <Buffer 00 00 00 00 00 00 00 00 00 00 00 00>

// 2.读取字符串长度
buffer = Buffer.from("汉字长度"); // 一个汉字3个字节，四个汉字会开辟一个12字节的内存空间
console.log(buffer); // 返回的buffer对象用16进制表示  <Buffer e6 b1 89 e5 ad 97 e9 95 bf e5 ba a6>

// buffer对象转字符串 Buffer.toString
console.log(buffer.toString()); // 汉字长度

// 3. 直接存二进制数据
// 0x表示16进制  0b表示二进制   0o表示8进制
buffer = Buffer.from([0x64, 0b11, 0o17]);
console.log("buffer", buffer); // <Buffer 64 03 0f>

// Buffer常用方法
// length toString  concat  isBuffer
// buffer不能动态扩容，只能通过concat拼接生成一个新的Buffer
const buffer1 = Buffer.alloc(2);
const buffer2 = Buffer.alloc(2);
const buffer3 = Buffer.concat([buffer1, buffer2]);
console.log("buffer3", buffer3); //<Buffer 00 00 00 00>

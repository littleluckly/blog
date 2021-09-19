const fs = require("fs");
const path = require("path");
const MyCreateWriteStream = require("./MyCreateWriteStream");
// const ws = fs.createWriteStream(path.resolve(__dirname, "new.txt"), {
const ws = new MyCreateWriteStream(path.resolve(__dirname, "new.txt"), {
  flags: "w",
  encoding: "utf8",
  autoClose: true,
  highWaterMark: 3, // 默认16k，水位线，用来控制缓存大小，每次写入write, 会先将内容写入内存中，再进行I/O操作，写入文件中，但是不会把所有内容全部写入内存中，导致内存溢出，highWaterMark就是用来控制写入内存的大小
});

// 只能传string后者buffer
// ws.write("123"); // 返回一个boolean值，表示达到水位线，true表示没有达到水位线
// ws.write("456");
// ws.write("789");
// ws.write虽然是一个异步方法，但是多次调用ws.write， 理论上是一个并发操作，但实际上会按照顺序执行
// 因为其内部有个链表，按照调用顺序将write加入一个内部链表中，按顺序执行
// 用数组也可以实现按顺序执行，每执行完一个write,就从数组中pop弹出一个，
// 但是数组性能不够好，因为从数据结构上来说，每pop一个，数组中其后每一项都要往前移动一个位置
// 用链表性能更好

let i = 0;
function write() {
  let canWrite = true;
  while (i < 10 && canWrite) {
    canWrite = ws.write(i++ + "");
  }
}
write();
ws.on("error", (err) => {
  console.log("err:", err);
});
ws.on("open", (fd) => {
  console.log("fd:", fd);
});
// 达到水位线时后，内存中的内容全部写入到文件之后的回调，即内存清空后再执行drain方法
ws.on("drain", () => {
  console.log("drain");
  write();
});

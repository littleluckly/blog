const fs = require("fs");
const EventEmitter = require("events");

// 继承EventEmitter的订阅发布模式
class MyCreateReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    // 处理默认参数
    this.flags = options.flags || "r";
    this.highWaterMark = options.highWaterMark || 60 * 1024; // 每次读取1024字节
    this.encoding = options.encoding || null;
    this.autoClose = options.autoClose === undefined ? true : options.autoClose;
    this.start = options.start || 0;
    this.end = options.end || Infinity;

    this.offset = this.start;
    this.open();

    // EventEmitter提供newLisenter事件，用来获取用户订阅的事件名
    this.on("newListener", (type) => {
      // 如果用于订阅了data事件，则需要触发fs.read
      if (type === "data") {
        this.read();
      }
    });
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        return this.emit(err);
      }
      this.fd = fd; // 文件描述符
      this.emit("open", fd);
    });
  }
  read() {
    // 问题：read执行的时候，需要拿到open方法提供的文件描述符fd
    // open又是一个异步方法，所以我们需要等待open执行完毕后才能执行read
    // how to do?
    // 判断fd是否存在
    if (typeof this.fd !== "number") {
      // 不存在，就订阅一次open方法, 实现open执行完毕后触发read
      return this.once("open", () => this.read());
    }
    console.log("fd", this.fd);
    const buffer = Buffer.alloc(this.highWaterMark);
    // this.highWaterMark有可能超过this.end, 所以需要动态判断当前已读取的内容字节数和this.end,this.highWaterMark的关系
    const howMuchToRead = this.end
      ? Math.min(this.end - this.offset + 1, this.highWaterMark)
      : this.highWaterMark;
    fs.read(
      this.fd,
      buffer, // 将读取的字节内容，存放到该buffer
      0, // 存放的起始位置
      howMuchToRead,
      this.offset,
      (err, bytesRead) => {
        // 实际读取的个数
        if (bytesRead) {
          this.offset += bytesRead;
          this.emit("data", buffer.slice(0, bytesRead));
          this.read();
        } else {
          this.emit("end");
          this.autoClose && this.emit("close");
        }
      }
    );
  }
}

module.exports = MyCreateReadStream;

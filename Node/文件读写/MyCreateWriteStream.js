const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

class MyCreateWriteStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.encoding = options.encoding || "utf8";
    this.flags = options.flags || "w";
    this.highWaterMark = options.highWaterMark || 16 * 1024;

    this.open();

    // 判断当前是否有正在写入的操作，有写入则加入缓存cache
    this.writing = false;
    this.needDrain = false;
    this.offset = 0; // 写入的偏移量
    this.len = 0; // 记录写入的长度, 用于和this.highWaterMark，cache判断是否清空 这2个条件共同判断是否需要执行drain回调
    this.cache = [];
  }

  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        this.emit("error", err);
        return;
      }
      this.fd = fd;
      this.emit("open", fd);
    });
  }
  // 暴露给用户的写入方法
  write(chunk, encoding = this.encoding, cb = () => {}) {
    // chunk可以是字符串，也可以是buffer
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    // 到达水位线后，告诉用户不能在继续写入了
    let ret = this.len < this.highWaterMark;
    if (!ret) {
      this.needDrain = true;
    }
    // 如果正在写入，则加入缓存中
    if (this.writing) {
      this.cache.push({
        chunk,
        encoding,
        cb,
      });
    } else {
      this.writing = true;
      this._write(chunk, encoding, () => {
        cb(); // 用户传入的回调
        this.clearBuffer();
      });
    }
    return ret;
    // this._write();
  }
  _write(chunk, encoding, cb) {
    // 执行写入逻辑前，要先拿到fd, open方法是异步的，准备写入时，可能fd还没有拿到
    // 可以使用发布订阅，监听open事件
    if (typeof this.fd !== "number") {
      return this.once("open", () => {
        this._write(chunk, encoding, cb);
      });
    }
    // 执行真正的写入操作
    fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
      this.len -= written;
      this.offset += written;
      cb();
    });
  }
  clearBuffer() {
    // 从缓存中取出第一个
    const data = this.cache.shift();
    if (data) {
      const { chunk, encoding, cb } = data;
      this._write(chunk, encoding, () => {
        cb();
        // 依次清空
        this.clearBuffer();
      });
    } else {
      // 缓存中没有数据，说明已被清空
      this.writing = false;
      if (this.needDrain) {
        this.needDrain = false;
        this.emit("drain");
      }
    }
  }
}

module.exports = MyCreateWriteStream;

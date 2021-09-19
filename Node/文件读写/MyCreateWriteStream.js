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
    this.len = 0; // 记录写入的长度, 用于和this.highWaterMark，cache是否清空 这2个条件共同判断是否需要执行drain回调
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
  write(chunk, encoding = this.encoding, cb = () => {}) {
    // chunk可以是字符串，也可以是buffer
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
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
      this._write(chunk, encoding, () => {});
    }
    return ret;
    // this._write();
  }
  _write(chunk, encoding, cb) {
    // 执行写入逻辑前，要先拿到fd, open方法是异步的，准备写入时，可能fd还没有
    // 可以使用发布订阅，监听open事件
    if (typeof this.fd !== "number") {
      this.once("open", () => {
        this._write(chunk, encoding, cb);
      });
    }
    console.log("write..", this.fd);
  }
}

module.exports = MyCreateWriteStream;

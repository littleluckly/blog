// fs fileSystem  操作文件、文件夹的方法
// 读取文件，返回的格式一般是Buffer类型

const fs = require("fs");
const path = require("path");

// 需求：复制一个文件
// 方法一：readFile writeFile
fs.readFile(path.resolve(__dirname, "bz.jpg"), (err, data) => {
  // data 读取的结果是一个buffer类型
  // 写入一个新的文件
  fs.writeFile(
    path.resolve(__dirname, "bz-copy-1.jpg"),
    data,
    (serr, sdata) => {
      if (sdata) {
        console.log("copy success");
      }
    }
  );
});
// 缺陷：读取的文件内容会存入到内存中，所以如果读取的是一个非常大的文件，会导致电脑死机， 这种复制方式不适合大文件

// 方法二：基于fs.open fs.read fs.wirte fs.close实现读取边读编写操作

function copy(source, target, cb) {
  const BUFFER_LENGTH = 3;
  let read_position = 0;
  let wirte_position = 0;
  const buffer = Buffer.alloc(BUFFER_LENGTH);
  fs.open(source, "r", function (err, rfd) {
    // fd: file descriptor文件操作符
    fs.open(target, "w", function (err, wfd) {
      // 边读边写，直到全部写完，才停止，所以需要一个递归不断的写
      function next() {
        fs.read(
          rfd,
          buffer,
          0,
          BUFFER_LENGTH,
          read_position,
          function (err, bytesRead) {
            // 有可能读取的内容字节数不足BUFFER_LENGTH,  用bytesRead实际读取的内容字节数
            if (err) return cb(err);
            if (bytesRead) {
              fs.write(
                wfd,
                buffer,
                0,
                bytesRead,
                wirte_position,
                function (err, written) {
                  read_position += bytesRead;
                  wirte_position += bytesRead;
                  next();
                }
              );
            } else {
              fs.close(rfd, () => {});
              fs.close(wfd, () => {});
              cb();
            }
          }
        );
      }
      next();
    });
  });
}
copy("./bz.jpg", "./bz-copy-2.jpg", () => {
  console.log("copy success");
});

// 该方法存在嵌套地狱问题，使用起来繁琐

// 方法三：文件可读流实现， 文件流内部是基于fs.open fs.read fs.close实现，采用了发布订阅模式
const rs = fs.createReadStream(path.resolve(__dirname, "./b.js"));
const chunkArr = [];
rs.on("data", function (chunk) {
  chunkArr.push(chunk);
});
rs.on("end", function () {
  console.log(Buffer.concat(chunkArr).toString());
});

// fs
// path

// 模块化方案
// CMD sea.js已基本淘汰
// AMD nodejs执行的规范  require.js
// ES6 module浏览器支持的方案

// AMD规范实现：module.exports  exports导出模块；require引入模块
// 大致实现流程
// 1. require方法传入文件相对路径
// 2. _resolveFilename将路径解析成绝对路径，并尝试增加后缀名.js  .json
// 3. _extensions策略模式，根据后缀名分别加载模块,
// 4. load方法执行加载
const fs = require("fs");
const path = require("path");
const vm = require("vm"); // 利用vm.runInThisContext执行字符串代码, 类型eval, new Function

function myRequire(relativePath) {
  // 解析模块
  const filename = Module._resolveFilename(relativePath);
  if (Module._cache[filename]) {
    return Module._cache[filename].exports;
  }

  // 创建模块
  const module = new Module(filename);
  Module._cache[module.id] = module;

  // 加载模块
  module.load();
  return module.exports;
}

class Module {
  static _cache = {}; // 保存已解析的模块（文件）
  static _extenstions = {
    ".js": function (module) {
      const content = fs.readFileSync(module.id);
      const str = Module.wrapper(content); // 包裹一层函数，传入exports、require、module、__dirname、__filename
      const fn = vm.runInThisContext(str);
      fn.call(
        module.exports, // AMD模块方案规定，模块内部的this指向exports
        module.exports,
        myRequire,
        module,
        module.id,
        module.path
      );
    },
    ".json": function (module) {
      const content = fs.readFileSync(module.id);
      module.exports = JSON.parse(content);
    },
  };

  static wrapper(content) {
    return `(function(exports, require, module, __filename, __dirname){${content}})`;
  }

  // 将文件名解析成带绝对路径的
  static _resolveFilename(relativePath) {
    // 默认解析.js .json， 传入的path可能带有后缀名，也可能不带
    const filepath = path.resolve(__dirname, relativePath);
    const isExist = fs.existsSync(filepath);
    if (isExist) return filepath;
    // 尝试解析.js .json
    const extensions = Reflect.ownKeys(Module._extenstions);
    for (let i = 0; i < Reflect.ownKeys(Module._extenstions).length; i++) {
      const newFilepath = filepath + extensions[i];
      if (fs.existsSync(newFilepath)) {
        return newFilepath;
      }
    }
    throw Error("module not found");
  }

  constructor(filename) {
    this.id = filename; // 保存模块（文件）的绝对路径
    this.exports = {}; // 保存文件的内容
    this.path = path.dirname(filename); // 保存文件的所属目录
  }

  load() {
    // 根据不同的文件类型，采用不同的策略模式进行加载
    const extName = path.extname(this.id);
    Module._extenstions[extName](this); // 将this,即module实例传入解析策略中
  }
}

const res = myRequire("./a.json");
const res2 = myRequire("./b.js");
console.log("res", res);
console.log("res2", res2);

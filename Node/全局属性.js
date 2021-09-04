// node中this默认指向全局属性gobal
// 但是在文件中，this不是global, 而是被module.exports改写
// console.log(this); // 输出{}

function a() {
  console.log(Reflect.ownKeys(this));
  console.log(this); // 输出全局属性global
}
// a();

// 全局属性，不声明可以直接使用的
// 全局属性global上有些特殊的属性，可以在全局访问到，
// 如：require exports module __dirname __filename，这些叫全局变量

// 全局属性 process
// console.log(process.platform);

// 当前工作目录  current working directory
// 可以被改变 process.chdir('目录')
// console.log(process.cwd());

// process.env
// 当前系统环境变量，如果要设置系统变量需要区分mac 和windows
// 第三方cross-env模块可以不区分系统，直接设置
// process.env.NODE_ENV = "production";
// console.log(process.env);

// process.argv
// 获取执行命令时的参数，最常见的比如运行webpack命令时携带的--config  --port等

// 如执行 `node 全局属性.js --config test`
// proces.argv返回一个数组，数组前两项时固定，后面才是具体的变量
console.log(process.argv);
const config = process.argv.slice(2).reduce((obj, curr, idx, arr) => {
  if (curr.startsWith("--")) {
    obj[curr.slice(2)] = arr[idx + 1];
  }
  return obj;
}, {});
console.log("config", config); // 输出{ config: 'a.test' }

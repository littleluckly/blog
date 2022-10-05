@[TOC](文章目录)

---

目标创建一个叫做`mcli`的cli工具，实现下载项目模板

###  创建项目文件夹

`mkdir vue-auto-router-cli`

###  初始化package.json

`npm init -y`

### 安装依赖

`npm i commander download-git-repo ora handlebars figlet clear chalk open watch -s`

| npm包名               | 作用                                                         |
| --------------------- | ------------------------------------------------------------ |
| **commander**         | 用于定制命令                                                 |
| **download-git-repo** | 用于下载github项目                                           |
| **ora**               | 用于显示加载loading                                          |
| **figlet**            | 可以在命令行输出类似logo的海报，用于打印欢迎页面，是一个异步过程 |
| **clear**             | 清理命令行界面                                               |
| **chalk**             | 修改命令行输入的字符颜色                                     |
| **open**              | 打开浏览器                                                   |
| **watch**             |                                                              |

### 自定义命令初体验

创建`/bin/mcli.js`文件

```js
#!/usr/bin/env node
// 上一行代码指定代码解释环境为node
console.log("cli");
```

`package.json`配置可执行命令

```json
  "bin": {
    "mcli": "./bin/mcli.js"
  },
```

这样就构建了一个命令`mcli`，在本地环境使用前，要先进行软连接`npm link`，相当于全局安装了`mcli`整个插件，然后就可以像其他命令行工具一样使用了

```js
mcli
// 执行mcli命令后，会执行/bin/mcli.js中的代码
```

### 定制命令mcli init <name\>, 实现在本地生成项目模板

目标：这一步主要借助于`commander`库，定制一条命令`mcli init <name>`，当输入该命令后，输出欢迎界面，从githuh下载一个vue项目模板到本地

#### 输出欢迎界面

- 修改`/bin/mcli.js`， 定制命令`mcli init <name\>`

```js
#!/usr/bin/env node
// 上一行代码指定解释环境
const program = require("commander");
program.version(require("../package.json").version);

// 定义一个新的命令 mcli init xxx
program
  .command("init <name>")
  .description("init project")
  .action((name) => {
    // 当前命令执行的内容
    console.log("init" + name);
  });
// process表示当前主进程
// argv 表示当前命令携带的参数
program.parse(process.argv);
```

此时再执行命令`mcli`，就会显示当前可以执行的命令，效果如下

![image-20210721211446501](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210721211446501.png)



- 定制命令`mcli init <name>`的执行内容，输出欢迎界面

新建文件`/lib/init.js`

```js
// node自带的工具库util
// promisify可以将普通的方法包装成promise风格
const { promisify } = require("util");

// figlet可以在命令行输出类似logo的海报，用于打印欢迎页面，是一个异步过程
const figlet = promisify(require("figlet"));
// 清屏
const clear = require("clear");
// chalk可以修改命令行输出的字符颜色
const chalk = require("chalk");

const log = (content) => console.log(chalk.green(content));

module.exports = async (name) => {
  clear();
  const welcomeContent = await figlet(`mcli Welcome`);
  log(welcomeContent);
};
```

修改`/bin/mcli.js`中定义的命令`mcli init <name>`，将该命令的执行内容修改为

```js
program
  .command("init <name>")
  .description("init project")
  .action(require("../lib/init"));
```



![image-20210721220445086](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210721220445086.png)

#### 下载项目模板

本次下载的项目基于vue实现，主要功能点有：登陆/注册、token校验、列表/分页、点赞/点踩、个人中心上传头像，修改密码。
**项目需要配置后端服务项目共同使用：https://github.com/littleluckly/vueDemoBackend.git** 

新建`/lib/download.js`

这一步主要涉及到如下知识点：

- `download-git-repo`库从github下载项目模板
- `ora`展示下载等待loading效果



```js
const { promisify } = require("util");

module.exports.clone = async function (repo, dest) {
  const download = promisify(require("download-git-repo"));
  // 下载项目模板过程中展示loading
  const ora = require("ora");
  const process = ora(`下载ing......${repo}`);
  process.start();
  await download(repo, dest);
  process.succeed();
};
```

再次修改`/lib/init.js`内容，引入模板下载代码

```js
module.exports = async (name) => {
  clear();
  const welcomeContent = await figlet(`mcli Welcome`);
  log(welcomeContent);

  // 下载项目模板
  const { clone } = require("./download");
  // 利用download-git-repo库下载项目，地址要求做一定的修改
  // 如下载的是http://github.com/littleluckly/vueDemo，则改成github:littleluckly/vueDemo
  // 众所周知的原因，github仓库下载过程可能很慢，要多试几次
  const repoName = "github:littleluckly/vueDemo"; 
  log("创建项目：");
  clone(repoName, name);
};
```

#### 安装项目依赖

前两步已经构建好了一个可用的命令了，已经通过运行`mcli init <name>`在本地创建了一个项目模板，为了有一个更好的体验，不仅可以创建一个项目模板，还希望能够自动安装该模板的依赖

这一步主要涉及到如下知识点

- 子进程`child_process`的`spawn`方法开启子进程，下载依赖。

  参考https://blog.csdn.net/chy555chy/article/details/52556318

  spawn使用方法：http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options

- 通过流`Stream`将子进程下载的依赖导入到主进程项目中

在`/lib/init.js`中定义开启子进程的方法

```js
// node自带的工具库util
// promisify可以将普通的方法包装成promise风格
const { promisify } = require("util");

// figlet可以在命令行输出类似logo的海报，用于打印欢迎页面，是一个异步过程
const figlet = promisify(require("figlet"));
// 清屏
const clear = require("clear");
// chalk可以修改命令行输出的字符颜色
const chalk = require("chalk");
// 载项目模板
const { clone } = require("./download");

const log = (content) => console.log(chalk.green(content));

// 开启子进程
const spawn = async (...args) => {
  const { spawn } = require("child_process");
  return new Promise((resolve) => {
    const proc = spawn(...args);
    // spwan开启的子进程返回两个标准输出 stdout 和 stderr 的流对象
    // 通过管道将pipe将子进程的流对象导入到主进程process
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on("close", () => {
      resolve();
    });
  });
};

module.exports = async (name) => {
  clear();
  const welcomeContent = await figlet(`mcli Welcome`);
  log(welcomeContent);

  // 下载项目模板
  // 利用download-git-repo库下载项目，地址要求做一定的修改
  // 如下载的是http://github.com/su37josephxia/vue-template，则改成github:su37josephxia/vue-template
  const repoName = "github:su37josephxia/vue-template";
  log("创建项目：");
  clone(repoName, name);

  // 安装依赖
  log("安装依赖");
  await spawn("cnpm", ["install"], { cwd: `./${name}` });
  log(`
  👌安装完成
  To get Start:
  =================
  cd ${name}
  npm run serve
  =================
  `);
};

```

#### 自动运行项目

安装依赖后，可以借助子进程进一步优化，自动运行项目，并在浏览器打开项目

- `spawn`开启子进程运行项目
- `open`库打开浏览器

```js
	const open = require('open')
  // 运行项目，打开浏览
  await spawn("npm", ["run", "serve"], { cwd: `./${name}` });
  open("http://192.168.3.5:8080/");
```


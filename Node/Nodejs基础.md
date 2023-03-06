## I/O

#### 文件读取

1. 同步读取` fs.readFileSync`

   ```js
   const fs = require('fs')
   // 同步读取
   // 返回的是Buffer对象，存储二进制信息
   // 1字节Byte=== 8bit(0/1)
   const data = fs.readFileSync('./conf.js')
   console.log('data', data.toString())
   ```

2. 异步读取 `fs.readFile`

   ```js
   const fs = require('fs')
   // 异步读取
   fs.readFile('./test.js', (err, data) => {
     if (err) throw err
     console.log('data', data.toString())
   })
   ```

3. async/await读取（promisify包装）

   ```js
   // async/await读取
   (async() => {
     const fs = require('fs')
     const { promisify } = require('util')
     const readFile = promisify(fs.readFile)
     const data = await readFile('./test.js')
     console.log('data3', data.toString());
   })()
   
   process.nextTick(async () => {
     const fs = require('fs')
     const { promisify } = require('util')
     const readFile = promisify(fs.readFile)
     const data = await readFile('./test.js')
     console.log('data4', data.toString())
   })
   
   // 也可以使用node默认提供的promise风格fs
   (async() => {
     const fs = require('fs').promises  
     const data = await fs.readFile('./test.js')
     console.log('data3', data.toString());
   })()	
   ```

4. 文件流steam

   ```js
   // 复制一个图片
   // 在后面的自定义cli工具，实现下载依赖就会用到此功能
   const fs = require('fs')
   const rs = fs.createReadStream('./1.jpeg') // 源文件流
   const ws = fs.createWriteStream('./1.copy.jpeg')//目标文件流
   rs.pipe(ws)//创建导管复制 
   ```



## 自定义cli工具

## 创建一个简单cli命令工具，并下载项目模板，安装依赖，启动项目，打开浏览器

   1. 创建工程

      ```js
      mkdir my-cli-vue-router
      cd my-cli-vue-router
      npm init -y
      npm i commander download-git-repo ora handlebars figlet clear chalk open -s
      ```

   2. 初体验-自定义命令

      1. 根目录创建bin/kkb.js

         ```js
         #!/usr/bin/env node
         console.log('my-cli')
         ```

      2. Package.json配置kkb命令

         ```json
         "bin": {
           "kkb": "./bin/kkb.js"
         },
         ```

      3. 使用kkb命令

         使用之前配置一个软连接`sudo npm link`, 就可以全局使用kkb命令了

   3. 定制命令行界面

      > 依赖：Commander.js。功能说明，使用全局命令kkb时，显示有多少可以使用的命令

      1. kkb.js文件

         ```js
         const program = require('commander') 
         // 命令：kkb -V
         program.version(require('../package').version)
         // 命令：kkb init <name>
         program
            .command('init <name>')
            .description('init project') 		
            .action(name => {
              require('../lib/init')(name)
            })
         // 解析命令的参数，如kkb init aa命令对应的参数是init aa
         program.parse(process.argv)
          
         ```

      2. 实现命令`kkb init <name>`功能

         1. 创建文件/lib/init.js，实现欢迎界面

            ```js
            const { promisify } = require('util')
            // 命令行文字横幅效果
            const figlet = promisify(require('figlet'))
            // 清屏效果
            const clear = require('clear')
            // 命令行文字颜色
            const chalk = require('chalk')
            
            const log = (content) => console.log(chalk.green(content))
            
            module.exports = async (name) => {
              clear()
              const data = await figlet('KKB Welcome')
              log(data)
            }
            ```

            <img src="/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210418102047650.png" alt="image-20210418102047650" style="zoom:50%;" />

         2. GitHub模板下载

            创建/lib/download.js

            ```js
            const { promisify } = require('util')
            
            module.exports.clone = async function (repo, desc) {
              const download = promisify(require('download-git-repe'))
              //  显示下载等在效果
              const ora = require('ora')
              const process = ora(`下载....${desc}`)
              process.start()
              await download(repo, desc)
              process.succeed()
            }
            ```

            修改init.js，调用download方法

            ```js
            const { clone } = require('./download')
            module.exports = async (name) => {
              clear()
              const data = await figlet('KKB Welcome')
              log(data)
              log(`🚀创建项目： ${name}`)
              // 初始化项目模板
              clone('github:su37josephxia/vue-template', name)
            }
            ```

         3. 实现依赖下载

            利用子进程，以及文件流下载依赖

            改写/lib/init.js

            ```js
            // 封装spawn子进程，使其可以采用async/await写法
            const spawn = async (...args) => {
              const { spawn } = require('child_process')
              return new Promise((resolve) => {
                const proc = spawn(...args)
                proc.stdout.pipe(process.stdout)
                proc.stderr.pipe(process.stderr)
                proc.on('close', () => {
                  resolve()
                })
              })
            }
            module.exports = async (name) => {
              clear()
              const data = await figlet('KKB Welcome')
              log(data)
              log(`🚀创建项目： ${name}`)
              // 初始化项目模板
              clone('github:su37josephxia/vue-template', name)
            
              //安装依赖
              log('安装依赖...')
              await spawn('npm', ['install'], { cwd: `./${name}` })
              log(
                chalk.green(`
                👌安装完成:
                To get Start: ===========================
                cd ${name}
                    npm run serve
                ===========================
                }`)
              )
              
              // TODO:启动服务，并打开浏览器
              open(`http://localhost:8080`);
              await spawn('npm', ['run', 'serve'], { cwd: `./${name}` })
            }
            ```

            

   


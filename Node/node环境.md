## node版本管理工具

1. 安装包管理工具
   `npm install -g n`

2. 安装node版本

   1. 安装最新稳定版
      `n stable`
   2. 安装最新版
      `n latest`
   3. 安装xxx版本
      如安装10.14.1版本：`n 10.14.1`

3. 删除某个版本
   `n rm 10.14.1`

4. 查看安装路径
   `n which 10.14.1`

5. 以指定的版本来执行脚本

   `n use 10.14.1 xxx.js`

6. 查看已经安装的版本
   `n ls`

7. 切换版本，输入n回车  出现node版本列表，上下键移动选择切换的版本后回车(切换非n安装的node版本会报错，删掉，使用n安装即可)
   `n`



## npm的镜像源管理工具

#### 安装

`npm i nrm -g`

#### 使用

- 查看npm源
  `nrm ls`

  ```shell
    npm ---------- https://registry.npmjs.org/
    yarn --------- https://registry.yarnpkg.com/
    tencent ------ https://mirrors.cloud.tencent.com/npm/
    cnpm --------- https://r.cnpmjs.org/
    taobao ------- https://registry.npmmirror.com/
    npmMirror ---- https://skimdb.npmjs.com/registry/
  ```

- 使用源
  `nrm use 名称`

- 新增源

  `nrm add 名称 地址`

- 删除源

  `nrm del 名称`



#### npm源配置命令

- 直接安装cnpm 

`npm install cnpm -g --registry=https://registry.npm.taobao.org`

- 直接更改源地址

`npm set registry https://registry.npm.taobao.org/`

- 查看npm源地址

`npm config list`

- 删除源地址

`npm config rm registry`




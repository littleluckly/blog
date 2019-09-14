# 腾讯云服务器 cvm 使用技巧

安装第三方软件一般是通过系统软件 yum 进行安装的，在使用 yum 之前可以先更新到最新版本`yum install -y`。
安装 Epel Release 可以让我们拥有更加丰富的软件资源，比如后续我们要使用的 Nginx ，就是包含在 EPEL Release 中的。执行命令`yum install epel-release -y`安装 Epel Release

#### 1.常用命令

- **查看软件安装信息**
  ```
    rpm -ql nginx
  ```
  rpm 是 linux 的 rpm 包管理工具，-q 代表询问模式，-l 代表返回列表，这样我们就可以找到 nginx 的所有安装位置了.
  <!-- rpm 只能查看通过 yum 安装的软件信息，如果要查看自己安装的软件信息则要通过`ps -ef | grep nginx`查看 -->
- **查看正在使用的服务和端口**
  可以通过执行 `netstat -tunlp`，`netstat -antup`，`lsof -i:PORT` 命令进行查看

  ```
  // 查看8080端口的占用情况
  lsof -i:8080

  // 查看当前所有tcp端口
  netstat -ntlp

  // 查看所有80端口使用情况
  netstat -ntulp | grep 80
  ```

- **编辑文件,使用系统自带的编辑器 vim**
  执行命令：`vim 文件路径及名称`，如：`vim /etc/nginx/nginx.conf`

- **新建文件**
  ```
  touch 文件名
  ```
- **新建文件夹**
  ```
  mkdir -p 文件夹名称
  ```
  -p 表示向下递归新建文件夹
- **删除文件/文件夹**
  ```
    rm -rf 文件路径及名称
  ```
  -r 就是向下递归，不管有多少级目录，一并删除
  -f 就是直接强行删除，不作任何提示的意思

#### 2.MySQL 安装 [参考](https://cloud.tencent.com/developer/labs/lab/10376)

在腾讯云上使用的是 MariaDB，它是 MySQL 的一个分支，完全兼容 MySQL

```
1.执行安装
yum install mariadb mariadb-server -y

2.启动
systemctl start mariadb.service
systemctl enable mariadb.service

3.配置MySQL
mysql_secure_installation

4.卸载MySQL
yum remove mariadb mariadb-server - y
```

---

#### 3.Node 安装 [参考](https://cloud.tencent.com/developer/labs/lab/10040)

```
1.下载最新的稳定版 v6.10.3 到本地
wget https://nodejs.org/dist/v6.10.3/node-v6.10.3-linux-x64.tar.xz

2.下载完成后, 将其解压
tar xvJf node-v6.10.3-linux-x64.tar.xz

3.将解压的 Node.js 目录移动到 /usr/local 目录下
mv node-v6.10.3-linux-x64 /usr/local/node-v6

4.配置 node 软链接到 /bin 目录
ln -s /usr/local/node-v6/bin/node /bin/node

5.配置 npm
ln -s /usr/local/node-v6/bin/npm /bin/npm

6.配置环境变量，将 /usr/local/node-v6/bin 目录添加到 $PATH 环境变量中可以方便地使用通过 npm 全局安装的第三方工具
echo 'export PATH=/usr/local/node-v6/bin:$PATH' >> /etc/profile
source /etc/profile

7.测试：使用npm安装依赖包
如 npm install express-generator -g
```

线上的 node 项目建议采用 pm2 管理、监控。
**安装**
执行`npm install -g pm2`

**使用**
全局安装后，使用 pm2 会提示没找不到命令，因为还需要将 pm2 软链接到 /bin 目录。
执行命令`ln -s /usr/local/node-v6/bin/pm2 /bin/pm2`后，就能正常使用 pm2 了。

- 设置开机启动
  `pm2 startup`，然后保存`pm2 save`

- pm2 启动进程
  执行命令`pm2 start node启动脚本路径`即可，如果启动进程时想要指定名称，可使用`pm2 start node启动脚本路径 --name 进程名称`

- 查看已启动的进程列表
  `pm2 list`

- 重启进程
  `pm2 restart 进程名称`

- 终止进程
  `pm2 stop 进程id`
- 杀死进程
  `pm2 delete 进程id`
- 查看进程日志
  `pm2 logs 进程名称`

#### 4.nginx 安装和使用 [参考 1](https://cloud.tencent.com/developer/labs/lab/10376)、[参考 2](https://www.cnblogs.com/zengfp/p/9897026.html)

```
1.安装 Nginx
yum install nginx -y

2.启动nginx
systemctl start nginx.service
执行启动命令后，并没有任何变化，可以执行命令ps aux | grep nginx 查看运行状况

3.停止nginx
systemctl stop nginx.service

4.重启nginx
systemctl reload nginx.service
systemctl restart nginx.service

5.卸载nginx
yum remove nginx -y

```

nginx 默认安装在根目录，index 文件在/usr/share/nginx/html 目录下，配置文件在/etc/nginx 目录下。nginx 安装路径信息可以通过命令`rpm -ql nginx`查看。
测试 nginx 配置文件是否正确，执行命令`/usr/sbin/nginx -t`

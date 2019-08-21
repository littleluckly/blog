# 腾讯云服务器 cvm 使用技巧

##### 1.MySQL 安装 [参考](https://cloud.tencent.com/developer/labs/lab/10376)

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

##### 2.Node 安装 [参考 1](https://cloud.tencent.com/developer/labs/lab/10371)、 [参考 2](https://cloud.tencent.com/developer/labs/lab/10040)

**方法一**
该实践过程中发现安装其他版本会报错，所以推荐第二种

```
1.执行安装
curl --silent --location https://rpm.nodesource.com/setup_8.x |  bash -
yum -y install nodejs

2.配置npm加速
npm install -g cnpm --registry=https://registry.npm.taobao.org

3.卸载node
yum remove nodejs

4.查看版本信息
node -v

5.查看安装信息
rpm -ql nodejs
```

**方法二**

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

7.使用npm
如 npm install express-generator -g
```

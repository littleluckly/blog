# Mongodb入门

## 安装（Mac ）

> 官网下载下载压缩包.tgz

> 解压到/usr/local，默认情况下，该目录不可见可以按下快捷键command+control+G显示隐藏目录。

```shell
# 进入/usr/local
cd /usr/local

# 解压
sudo tar -zxvf mongodb-xxxx.tgz

# 重命名
sudo mv mongodb-xxxx/ mongodb

# 添加path目录
vim ~/.bash_profile
export PATH=/usr/local/mongodb/bin:$PATH
```

> 创建数据存放目录

```shell
sudo mkdir -p /usr/local/var/mongodb
```

> 创建日志文件目录

```shell
sudo mkdir -p /usr/local/var/log/mongodb
```

> 对日志和数据目录授权

```shell
sudo chown xiongweiliu /usr/local/var/mongodb
sudo chown xiongweiliu /usr/local/var/log/mongodb
```

## 启动

> 后台启动

```shell
mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
```

> 查看状态

```shell
ps aux | grep -v grep | grep mongod
```



## 常用命令

```shell
# 客户端连接
mongo 

# 查看数据库
show dbs
show databases

# 使用数据库
use dbName
```


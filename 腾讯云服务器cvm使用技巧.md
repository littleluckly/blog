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

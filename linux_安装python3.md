# linux 下安装 python3

#### 1. 安装 gcc

检查系统是否已经安装 gcc, `gcc --version`, 如没有安装 gcc, 执行命令`yum -y install gcc`安装

#### 2. 安装其他依赖

缺少依赖包可能导致 python 安装报错

```
yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel libffi-devel
```

#### 3.下载 python 源码

3.1) 下载。在https://www.python.org/ftp/python/中选择自己需要的python源码包

```
wget https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tgz
```

3.2） 解压

```
tar -zxvf Python-3.7.0.tgz
```

#### 4.建立一个空文件夹，用于存放 python3 程序

```
mkdir /usr/local/python3
```

#### 5.执行配置文件，编译，编译安装

执行下述命令后没有提示错误便安装成功了

```
cd Python-3.7.0
./configure --prefix=/usr/local/python3
make && make install
```

#### 6.建立软连接

```
ln -s /usr/local/python3/bin/python3.7 /usr/bin/python3
ln -s /usr/local/python3/bin/pip3.7 /usr/bin/pip3
```

#### 7.安装 web.py

此种方式安装的 web.py 默认是基于 python2 的版本。
暂时还没有找到基于 python3 版本的 web.py。
7.1) `wget http://webpy.org/static/web.py-0.37.tar.gz`
7.2) `tar xvfz web.py-0.37.tar.gz`
7.3) `cd web.py-0.37`
7.4) `sudo python setup.py install`

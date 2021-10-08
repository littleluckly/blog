# docker入门

##  安装

1、**卸载老版本**

```shell
# 1、卸载老版本
yum remove docker \
docker-client \
docker-client-latest \
docker-common \
docker-latest \
docker-latest-logrotate \
docker-logrotate \
docker-engine
```

2、**需要的安装依赖包**

```shell
# 2、需要的安装依赖包
yum install -y yum-utils
```

3、**添加软件源信息**

```shell
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

4、**安装docker相关包**

```shell
yum install docker-ce docker-ce-cli containerd.io
```

5、**查看docker安装信息**

```shell
docker version
```

6、**启动**

```shel
systemctl start docker
```

7、**运行hello-world测试**

```shel
docker run hello-world
```

8、**查看是否存在hello-worl镜像**

```shell
docker iamges
```



9、 **阿里云镜像加速**

![image-20200614194322013](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\image-20200614194322013.png)

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://eqceu4kv.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```



## Docker的常用命令

### 帮助命令

```shell
docker verison
docker info
docker 命令 --help 查看具体命令的帮助信息
```

帮助文档地址： [https://docs.docker.com/reference/]()

### 镜像命令

**docker images** 查看本机上的所有镜像

```shell
[root@izwz97hiuiqjyf0qhdbcfpz lib]# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
hello-world         latest              bf756fb1ae65        5 months ago        13.3kB
[root@izwz97hiuiqjyf0qhdbcfpz lib]# 

```

**docker search** 搜索镜像

```shel
docker search mysql
```

**docker pull** 下载镜像

```shell
[root@izwz97hiuiqjyf0qhdbcfpz lib]# docker pull mysql
Using default tag: latest # 如果不写tag默认写下载最新的
latest: Pulling from library/mysql
8559a31e96f4: Pull complete # 分层下载，docker image的核心，联合文件下载系统
d51ce1c2e575: Pull complete 
c2344adc4858: Pull complete 
fcf3ceff18fc: Pull complete 
16da0c38dc5b: Pull complete 
b905d1797e97: Pull complete 
4b50d1c6b05c: Pull complete 
c75914a65ca2: Pull complete 
1ae8042bdd09: Pull complete 
453ac13c00a3: Pull complete 
9e680cd72f08: Pull complete 
a6b5dc864b6c: Pull complete 
Digest: sha256:8b7b328a7ff6de46ef96bcf83af048cb00a1c86282bfca0cb119c84568b4caf6  #签名
Status: Downloaded newer image for mysql:latest
docker.io/library/mysql:latest  # 真实地址


docker pull mysql 等价于 docker pull docker.io/library/mysql:latest

# 下载指定版本
docker pull 镜像:版本号  # 可以去hub.docker网站查找版本号
```

docker -rmi -f  删除镜像

```she
docker rmi -f 容器id # 删除指定镜像
docker rmi -f $(docker images -aq) # 删除镜像
```



### 容器命令

**说明：有镜像才可以创建容器，下载centos镜像来测试学习**

```shell
docker pull centos
```

**新建容器并启动**

```shell
docker run [可选参数] image

# 参数说明
--name=“name” 容器名字
-d 后台运行方式
-p 指定容器端口
 	-p 宿主机端口:容器端口
-it 使用交互方式运行，进入容器查看内容

# 测试，启动并进入容器
[root@izwz97hiuiqjyf0qhdbcfpz lib]# docker run -it centos /bin/bash
[root@812d80b3d257 /]# 

# 使用docker run新建一个容器时，如果没有找到镜像，会自动下载镜像
```

**列出所有容器**

```shell
# docker ps [可选参数]
-a 		# 列出当前所有的容器+历史运行过的容器
-n=?	# 显示最近创建的容器
-q		# 只显示容器的id

[root@izwz97hiuiqjyf0qhdbcfpz ~]# docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               S
2f3b59ace4dc        centos              "/bin/bash"         10 hours ago        Exited (127) 10 hours ago                       rsing_haslett
812d80b3d257        centos              "/bin/bash"         10 hours ago        Exited (127) 10 hours ago                       ious_wilson
b9031d4bca5b        hello-world         "/hello"            12 hours ago        Exited (0) 12 hours ago                         mistic_hoover
[root@izwz97hiuiqjyf0qhdbcfpz ~]# 

```

**退出容器**

```shell
exit #停止容器并退出
ctrl + p + q #不停止容器退出
```

**删除容器**

```shell
docker rm 容器id						#删除指定容器，但是不能删除运行中的容器
docker rm -f				 		 #强制删除所有容器
docker ps -a -q|xargs docker rm -f 	 #强制删除所有容器

```

**启动和停止容器**

```shell
docker start 容器id
docker restart 容器id
docker stop 容器id
docker kill 容器id		#强制停止容器
```






### 常用其他命令

**后台启动容器**

```shell
# 命令用法
docker run -d 镜像名

#测试
[root@izwz97hiuiqjyf0qhdbcfpz ~]# docker run -d centos
9a695460405be0f1673ec6c02fe0433c566e4faa972b8c3e56ce58b4c642f496
[root@izwz97hiuiqjyf0qhdbcfpz ~]# 

#问题：启动后立马停止了
#常见的坑： docker容器使用后台运行，前提是必须有一个正在运行的进程，否则docker发现没有应用，就会停止

```

**查看日志** 

```shell
# 命令用法
docker logs [可选参数] 容器id

# 编写一段shell脚本，写日志
[root@izwz97hiuiqjyf0qhdbcfpz ~]# docker run -d centos /bin/sh -c "while true; do echo test;sleep 2;done"

# 查看最近10条日志
[root@izwz97hiuiqjyf0qhdbcfpz ~]# docker logs --tail 10 a72310fd5194
test
test
test
test
test
test
test
test
test
test
```

**查看容器中的进程信息**

```shell
# 命令用法
docker top 容器id

#测试
[root@izwz97hiuiqjyf0qhdbcfpz ~]# docker top 4bcb29150982
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                14480               14448               0                   07:54               pts/0               00:00:00            /bin/sh
```

**查看容器元信息**

```shell
docker inspect 容器id
```

**进入当前正在运行的容器**

```shell
# 命令用法
docker exec -it 容器name bash

# 测试
[root@izwz97hiuiqjyf0qhdbcfpz ~]# docker exec -it 4bcb29150982 /bin/sh
sh-4.4# ls
bin  dev  etc  home  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
sh-4.4# 

# 方式二
docker attache 容器id 

# 两种方式的区别
# docker exec   	# 进入容器后开启一个新的终端，可以在里面操作
# docker attach		# 进入容器正在执行的终端，不会启动新的进程

```

**从容器中拷贝文件到主机上**

```shell
# 用法
docker cp 容器id:容器文件路径 主机文件路径
```



###  练习：nginx部署

0、**原理介绍**

![image-20200616222347001](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\image-20200616222347001.png)



1、**部署步骤**

```shell
# 下载镜像
docker pull nginx

# 查看镜像
docker images

# 启动容器
docker run -d --name nginx01 -p 3344:80 nginx #表示将容器命名为nginx01，对外暴露3344端口的方式启动80端口的nginx

# 进入nginx容器
docker exec -it nginx01 /bin/bash

# 配置云服务器安全组放开3344端口

# 查找nginx的配置路径
whereis nginx
root@17141a7e0007:/# whereis nginx
nginx: /usr/sbin/nginx /usr/lib/nginx /etc/nginx /usr/share/nginx

```

**思考：**

到目前为止所掌握到知识，要修改容器的配置需要进入到容器内部，十分麻烦，要是能在容器外部配置，自动同步到容器内容就会变得非常方便。



## Docker镜像

### 镜像是什么

### 加载原理

### commit镜像

```shell
docker commit -m="提交信息" -a="作者" 容器id 目标镜像名:[tag]
```



## 容器数据卷

### 什么是容器数据卷

![image-20200617075402033](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\image-20200617075402033.png)

![image-20200617075552357](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\image-20200617075552357.png)

### 使用容器数据卷

> 方式一： 使用命令来挂载 -v

```shell
# 命令
# -v 容器内路径					# 匿名挂载
# -v /宿主机目录:容器内路径	 	 # 指定路径挂载
# -v 卷名:容器内路径		   	   # 具名挂载
# -v /宿主机目录:容器内路径:ro	 # 指定路径挂载,并指定只读属性，只能在宿主机读写
# rw 读写
# ro 只读
docker run -it -v /主机目录:容器目录

# 操作
[root@izwz97hiuiqjyf0qhdbcfpz home]# docker run -it -v /home/ceshi:/home centos /bin/bash

# 检查元数据，是否有Mounts
root@57ee874bca55 /]# [root@izwz97hiuiqjyf0qhdbcfpz home]# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
57ee874bca55        centos              "/bin/bash"              41 seconds ago      Up 40 seconds                              stoic_nash
[root@izwz97hiuiqjyf0qhdbcfpz home]# docker inspect 57ee874bca55
```

![image-20200617080839737](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\image-20200617080839737.png)



### 实战：安装mysql

```shell
# 下载镜像
docker pull mysql:5.7  # 下载前可以去官网https://hub.docker.com/查找版本号

# 创建容器
-v 卷挂载
-e 环境配置
docker run -d -p 3310:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7

# 进入容器查看
docker exec -it mysql01 bash
```



### 初识Dockfile

![image-20200617225903765](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\image-20200617225903765.png)













##  DockerFile

dockerfile 是用来构建docker镜像的文件，命令参数脚本

构建步骤：

- 编写一个dockerfile文件
- docker build 构建一个镜像
- docker run 运行镜像
- docker push  镜像（dockerHub、阿里云镜像仓库）

## Docker网络






































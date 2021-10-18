# nginx

### nginx安装

#### 方式一：yum安装默认版本

- 安装：`yum -y install nginx`
- 查看安装位置：`whereis nginx`
- 启动 `systemctl start nginx.service`
- 停止 `systemctl stop nginx.service`
- 重启 `systemctl restart nginx.service`
- 查看状态 `systemctl status nginx.service`，可以查看到状态、配置文件地址、进程id等信息

![image-20211010101639411](https://i.loli.net/2021/10/10/YlSbsHM89o1T2JI.png)

- 查看进程信息 `ps -ef | grep nginx`

#### 方式2：yum安装指定版本

在 `/etc/yum.repos.d/`目录下配置指定nginx源

- `vim /etc/yum.repos.d/nginx.repo`
- 配置源

```shell
[nginx]   
name=nginx repo   
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/   
gpgcheck=0   
enabled=1
```

- 安装`yum install nginx -y`

- 查看版本： `nginx -v`

- 查看其他信息： `nginx -V`（大写V）安装路径、配置文件路径、可执行文件路径等

  ```shell
  
  [root@root ~]# nginx -V
  nginx version: nginx/1.20.1
  built by gcc 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC) 
  built with OpenSSL 1.1.1g FIPS  21 Apr 2020
  TLS SNI support enabled
  configure arguments: --prefix=/usr/share/nginx --sbin-path=/usr/sbin/nginx --modules-path=/usr/lib64/nginx/modules --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --http-client-body-temp-path=/var/lib/nginx/tmp/client_body --http-proxy-temp-path=/var/lib/nginx/tmp/proxy --http-fastcgi-temp-path=/var/lib/nginx/tmp/fastcgi --http-uwsgi-temp-path=/var/lib/nginx/tmp/uwsgi --http-scgi-temp-path=/var/lib/nginx/tmp/scgi --pid-path=/run/nginx.pid --lock-path=/run/lock/subsys/nginx --user=nginx --group=nginx --with-compat --with-debug --with-file-aio --with-google_perftools_module --with-http_addition_module --with-http_auth_request_module --with-http_dav_module --with-http_degradation_module --with-http_flv_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_mp4_module --with-http_perl_module=dynamic --with-http_random_index_module --with-http_realip_module --with-http_secure_link_module --with-http_slice_module --with-http_ssl_module --with-http_stub_status_module --with-http_sub_module --with-http_v2_module --with-http_xslt_module=dynamic --with-mail=dynamic --with-mail_ssl_module --with-pcre --with-pcre-jit --with-stream=dynamic --with-stream_ssl_module --with-stream_ssl_preread_module --with-threads --with-cc-opt='-O2 -g -pipe -Wall -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -fstack-protector-strong --param=ssp-buffer-size=4 -grecord-gcc-switches -specs=/usr/lib/rpm/redhat/redhat-hardened-cc1 -m64 -mtune=generic' --with-ld-opt='-Wl,-z,relro -specs=/usr/lib/rpm/redhat/redhat-hardened-ld -Wl,-E'
  ```

  - --prefix=/usr/share/nginx 表示安装路径
  - --sbin-path=/usr/sbin/nginx 表示可执行文件路径
  - --conf-path=/etc/nginx/nginx.conf 表示配置文件路径

- 查看安装文件 `rpm -ql nginx`

### 配置文件

通过命令`nginx -V`或者 `systemctl status nginx.service`找到配置文件路径是：`/etc/nginx/nginx.conf`

#### 配置基础

```shell
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx; # 启动nginx的用户
worker_processes auto;    # 工作进程数，一般取cpu的核心数
error_log /var/log/nginx/error.log; # 日志记录位置
pid /run/nginx.pid; # 工作进程id存放路径, 存放的是主进程id

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
		# 定义日志格式 名称
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;  # 访问日志

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;  # include:拆分出去的子配置。mime.types:根据文件后缀设置Content-Type
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf; # include:拆分出去的子配置

		# 服务相关配置, 一个http可以配置多个server, 即一个服务器承载多个网站
    server { 
        listen       80;     # 监听端口
        listen       [::]:80;
        server_name  _;      # 服务域名：可配置 域名 || 泛域名 || ip
        root         /usr/share/nginx/html;  # 文件的根路径 根目录

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;   # include:拆分出去的子配置
  
        
        error_page 404 /404.html;
        
        # 重点的重点，资源加载的匹配规则
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }s
}

```



配置项说明：

最主要的是配置项是http、server、location配置

- `http` 启动一个web服务
- `server` 一个http可以配置多个server服务，多个server可以指向同一个服务的不同资源

- `include`:拆分出去的子配置。
  - 如：`include   /etc/nginx/mime.types;` mime.types:根据文件后缀设置Content-Type
  - 如：`include   /etc/nginx/conf.d/*.conf;`  通常将不同的前端服务拆分成多个不同的*.conf文件

##### 配置文件实战小测试：

目标配置一个服务，域名为www.test1.com，其首页静态资源指向 `/usr/share/nginx/html/test/index.html`。

1. 新建一个配置文件 `/etc/nginx/conf.d/test1.conf`  
   - nginx会自动加载`test1.conf`文件，因为主配置文件 `/etc/nginx/nginx.conf`中有一个配置项：`include /etc/nginx/default.d/*.conf;`
2. 配置内容：

```shell
server {
	server_name     www.test1.com;
	root 						/usr/share/nginx/html/test1;
}
```

3. 重新加载配置文件 `systemctl reload nginx.service`
4. 新建index.html文件内容

在目录 `/usr/share/nginx/html/test`下新建`index.html`文件

内容为：

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    nginx test1
  </body>
</html>
```

4. 配置域名映射`/etc/host`

   由于没有购买dns解析，域名`www.test1.com`并不能正确解析到我们真实的ip地址，需要我们可以通过配置 `/etc/hosts `来模拟实现域名的解析

   ```shell
   # 添加一条域名映射记录
   120.24.xxx.xx www.test1.com
   ```

   ip地址在我们购买的云服务实例中获取

   ![image-20211012220030887](https://i.loli.net/2021/10/12/XFGHlOUCudbtNSo.png)

5. 测试是否生效

使用`curl`测试访问域名`http://www.test1.com`，是否能够正确返回`index.html`文件

```shell
[root@root /]# curl http://www.test1.com
<!DOCTYPE html>
<html lang="en">
  <body>
    nginx test1
  </body>
</html>
[root@root /]# 
```

6. 本地真实环境测试

由于同样的原因dns无法正确解析域名`http://www.test1.com`，在本地电脑同样需要配置域名映射`hosts`文件，才能正确访问`www.test1.com`

- windows系统的hosts文件目录是：C盘`Windows/System32/drivers/etc/hosts`

- mac系统使用命令： `sudo vim /etc/hosts`

```shell
# 添加一条域名映射记录
120.24.xxx.xx www.test1.com
```

效果：

![image-20211012220446339](https://i.loli.net/2021/10/12/a7UV1FJjqLKZE3m.png)

#### nginx处理http流程

![nginx处理http的流程](https://i.loli.net/2021/10/14/HNsu6fy1RSqPL2t.png)

#### server_name配置

一个http可以配置多个server，多个server可以指向同一个服务的不同地址，他们之间遵循一定的匹配规则

- 完全匹配
- 通配符在前的，如*.test.com
- 在后的 www.test.*
- 正则匹配，如~^\.www\.test\.com$
- 如果都不匹配
  - 优先选择listen配置项后有default或default_server的
  - 找到匹配listen端口的第一个server块

```shell
server {  # 配置1
	server_name	a.test.com;
	location / {
		return 200 '完全匹配';
	}
}
server {  # 配置2
	server_name	*.test.com;
	location / {
		return 200 '通配符在前'
	}
}
server {  # 配置3
	server_name	www.test.*;
	location / {
		return 200 '通配符在后';
	}
}
server {  # 配置4
	server_name	~^(www\.)?(?<domain>.+)\.com$;
	location / {
		return 200 "正则匹配：$domain";
	}
}
server {  # 配置5
        listen          80 default;
        server_name     justdoit;
        location / {
                return 200 '默认匹配';
        }
}

# 如上多个server配置，
# 访问 a.test.com，会匹配到配置1
[root@root ~]# curl a.test.com
完全匹配
# 访问 b.test.com，会匹配到配置2
[root@root ~]# curl b.test.com
通配符在前
# 访问 www.test.3.com，会匹配到配置3
[root@root ~]# curl www.test.3.com
通配符在后
[root@root ~]# curl www.mydomain.com
正则匹配：mydomain
[root@root ~]# curl abc.abc.com2
默认匹配

```



![image-20211013230227504](https://i.loli.net/2021/10/13/eFqGJtbK5QoAgrd.png)

server_name也可以同时写多个规则，用空格分隔

```shell
server {  # 配置1  多个规则空格分隔
	server_name	www.test.*
							www.mydomain.com;
	location / {
		return 200 '通配符在后';
	}
}
server {  # 配置2
	server_name	~^(www\.)?(?<domain>.+)\.com$;
	location / {
		return 200 "正则匹配：$domain";
	}
}

[root@root ~]# curl www.mydomain.com
通配符在后
# www.mydomain.com 匹配了配置1
```



### 内置核心模块

#### 监控nginx状态

> 模块名

--witch-http_stub_status_module  监控nginx客户端的状态。

使用`status -V`可以查看nginx安装了哪些模块

> 语法

```shell
stub_status	on/off  
# 默认值off
# 上下文：可以配置在server、location中
```

> 实战小测验

1. 开启配置

```shell
location /status {
	stub_status	on;
}
```

2. 重新加载配置 `systemctl reload nginx.service`

3. 查看效果：

   accepts:  总共处理连接数

   handled: 成功创建的握手次数

   requests: 总共处理的请求数

![image-20211014080015822](https://i.loli.net/2021/10/14/Q6Dpn4B2EfRgzH5.png)

>  补充：开源监控框架：nagios



#### 内容替换

> 模块名

--with-http_sub_module

> 语法

```shell
sub_filter	string replacement 
# 上下文：可以配置在http service location中
```



#### 连接限制 connect

连接和请求的区别，建立一次连接后，会保持连接状态，keep-alive，后续一段时间内的请求都可以复用这一次请求

> 模块名

--with-limit_conn_module  连接频率限制

> 测试多线程工具： httpd-tools

```shell
# ab -n 总共请求次数 -c 并发请求数 请求地址
# c并发数，单词全称concurrency
ab -n 10 -c 10 http://127.0.0.1
```

> 语法

- 定义共享内存limit_conn_zone、 key、  内存大小
- 定义并发数limit_conn

```shell
    # 定义一个连接限制的内存地址名称conn_zone, 并指定内存大小10m
    limit_conn_zone $binary_remote_addr zone=conn_zone:10m;
    server {
        listen       80;
        listen       [::]:80;
        server_name  localhost;
        root         /usr/share/nginx/html;

        location / {
                #连接限制：配置内存名称conn_zone 和 并发数限制为1
                limit_conn conn_zone 1;
                # 超出限制的返回500
                limit_conn_status 500;
                limit_conn_log_level warn;
                limit_rate 200; # 传输速度200字节  设置小一点，方便测试观察
			 }
```

测试：

`ab -n 10 -c 10 http://127.0.0.1/`

测试结果

```shell
Concurrency Level:      2
Time taken for tests:   13.009 seconds
Complete requests:      2  #请求次数2
Failed requests:        1  #失败次数1
   (Connect: 0, Receive: 0, Length: 1, Exceptions: 0)
Write errors:           0
Non-2xx responses:      1

```



#### 请求限制request

请求限制req在连接限制conn之前生效，采用的是漏斗算法，把突出的流量限定为美妙恒定多少个请求

> 模块名

--with-limit-req_module 请求频率限制

> 语法

- 定义共享内存limit_req_zone

```shell
 #  定义一个请求限制的内存地址名称req_zone, 并指定内存大小10m，限制每秒请求一个
limit_req_zone $binary_remote_addr zone=req_zone:10m rate=1r/s;
server	{
	location / {
		limit_req zone=req_zone;
	}
}
```

测试 `ab -n 5 -c 5 http://127.0.0.1/`，因为限制了每秒一个请求，所以会失败4个

> 控制缓存数量

用户的实际请求不可控制，有可能第一秒5个请求 第二秒0个请求，如果配置了请求显示为每秒一个1r/s，则会有4个请求失败。

在nginx采用漏斗算法，会将多余的请求放到一个漏斗中存储起来，然后将他们按顺序恒定取出，即配置burst

```shell
 #  定义一个请求限制的内存地址名称req_zone, 并指定内存大小10m，限制每秒请求一个
limit_req_zone $binary_remote_addr zone=req_zone:10m rate=1r/s;
server	{
	location / {
		limit_req zone=req_zone burst=4; # burst控制漏斗大小，缓存数量
	}
}
```

测试 `ab -n 5 -c 5 http://127.0.0.1/`，即使限制了每秒一个请求，但是因为配置了burst， 所以5个请求都会成功

![image-20211017091011987](https://i.loli.net/2021/10/17/jEqvMhRwDGl5IeP.png)



#### 访问控制

基于ip的访问控制 

>  模块名

-http_access_module

> 语法

**允许访问**

```shell
# 语法
# allow address|all
# 可以配置在http server location 	limit_except中
```

**禁止访问**

```shell
# 语法
# deny address|CIDR|all
# 可以配置在http server location 	limit_except中
```

**配置**

给admin.html路径配置一个访问禁止后，该ip就不能访问了，也可以通过`/var/log/nginx/access.log`查看日志

```shell
location = /admin.html {
	deny 113.87.164.102;
	allow all;
}

```

![image-20211017100149922](https://i.loli.net/2021/10/17/WNfuZQkb4MLKijO.png)





### 静态资源web服务

静态资源：存放在服务器的静态文件如html css js

动态资源：经过web容器，从数据库获取动态数据，在返回给客户端的资源，如ajax

CDN: 内容分发网络，能够根据网络流量和各节点的连接、负载状况以及到用户的距离和响应时间，向客户端返回最近的资源，提高用户访问速度



#### 配置项

##### sendfile

不经过内核直接发送文件

用法:  `sendfile on/off`, 默认off

可配置在http server location中

##### tcp_nopush

在sendfile开启情况下，合并多个数据包，提高网络包的传输效率，

类比点一个外卖套餐，套餐里的单品单个派送，而是作为一个整体派送

用法:  `tcp_nopush on/off`, 默认off

可配置在http server location中

##### tcp_nodelay

和 `tcp_nopush`相反，立即发送，在keep-alive连接下，提高网络包传输的实时性

用法:  `tcp_nodelay on/off`, 默认on

可配置在http server location中

##### gzip

压缩文件，节省带宽和传输时间

用法： `gzip on/off` 默认off

相关配置：` gzip static`

- `gzip_static`:  在开启gzip压缩情况下，会动态的压缩资源文件，这个过程也是需要消耗性能和时间，可以通过事先压缩文件，再开启`gzip_static  on`，跳过动态压缩步骤，直接在服务器上查找压缩文件 

- `gzip_min_length  1k` 只压缩超过1K的文件
- `gzip_http_version	1.1`;	启用gzip压缩的http版本，低版本的不支持gz文件
- `gzip_comp_level		5`, 压缩级别，越大压缩程度越高，压缩后的文件越小
- `gzip_types	 text/css	text/html	text/javascript;` 压缩的文件类型





#### 实战案例



```shell
server {
	listen				80;
	root					/usr/share/nginx/test3;
	# ~ 表示使用正则
	# 正则：.*表示任意字符
	location	~ .*\.(jpg|png|jpeg|gif)$ {
		gzip				off;
		root				/usr/share/nginx/test3/images;
		
	}
	location ~ .*\.(html|css|js)$ {
		root							/usr/share/nginx/test3/html;
		gzip						  on;
		gzip_min_length	  1k;   # 超过1k大小，才压缩
		gzip_http_version	1.1;	# 启用gzip压缩的http版本，低版本的不支持gz文件
		gzip_comp_level		5;		# 压缩级别，越大压缩程度越高，压缩后的文件越小
		gzip_types				text/css	text/html	text/javascript;	# 压缩的文件类型
	}
}
```



进展：30


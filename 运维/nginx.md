# nginx

### nginx安装

##### 方式一：yum安装默认版本

- 安装：`yum -y install nginx`
- 查看安装位置：`whereis nginx`
- 启动 `systemctl start nginx.service`
- 停止 `systemctl stop nginx.service`
- 重启 `systemctl restart nginx.service`
- 查看状态 `systemctl status nginx.service`，可以查看到状态、配置文件地址、进程id等信息

![image-20211010101639411](https://i.loli.net/2021/10/10/YlSbsHM89o1T2JI.png)

- 查看进程信息 `ps -ef | grep nginx`

##### 方式2：yum安装指定版本

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

通过命令`nginx -V`或者 `systemctl status nginx.service`找到nginx的配置文件路径是：`/etc/nginx/nginx.conf`

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

		# 服务相关配置
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
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2;
#        listen       [::]:443 ssl http2;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers HIGH:!aNULL:!MD5;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}

```

![image-20211012200136014](https://i.loli.net/2021/10/12/8LGtHAES9qZpM65.png)



配置文件实战小测试：

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

3. 新建index.html文件内容

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

4. 配置`/etc/host`

   由于没有购买dns解析，域名`www.test1.com`并不能正确解析到我们真实的ip地址，需要我们可以通过配置 `/etc/hosts `来模拟实现域名的解析

   ```shell
   # 添加一条记录
   120.24.xxx.xx www.test1.com
   ```

   ip地址在我们购买的云服务实例中获取

   ![image-20211012220030887](https://i.loli.net/2021/10/12/XFGHlOUCudbtNSo.png)

5. 测试是否生效

使用`curl`测试访问域名`http://www.test1.com`，是否能够正确返回index.htmls文件

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

由于同样的原因dns无法正确解析域名`http://www.test1.com`，在本地电脑同样需要配置hosts文件，才能正确访问`www.test1.com`

windows系统的hosts文件目录是：C盘`Windows/System32/drivers/etc/hosts`

mac系统使用命令： `sudo vim /etc/hosts`

```shell
# 添加一条记录
120.24.xxx.xx www.test1.com
```

效果：

![image-20211012220446339](https://i.loli.net/2021/10/12/a7UV1FJjqLKZE3m.png)


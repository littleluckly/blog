mac配置

主要是通过配置host

## 查找ip地址

查找方法：[http://ping.chinaz.com/](http://ping.chinaz.com/)

查找目标：

- `github.com` 
-  `assets-cdn.github.com`
- `github.global.ssl.fastly.net` // 整个域名国内的ip基本超时

## 配置hosts

- 执行命令`sudo vim /etc/hosts`打开host文件

- 执行`i`，进入编辑模式

将查找到ip写入host中，格式如下：

```js
13.229.188.59  github.com
185.199.108.153  assets-cdn.github.com
```

- 点击键盘`esc`键退出编辑模式，然后输入`:wq`保存
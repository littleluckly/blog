## 命令菜单

**打开菜单**

`ctrl+shift+p`

`command+shift+p` mac系统

**命令详解**

1. 改变主题

   输入关键字 `theme`, 就可以过滤出主题相关的命令，选择其中一个即可

   ![image-20210915080800984](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210915080800984.png)

2. 截屏

   搜索关键字 `screen`,过滤出截屏的三个命令

   - 区域截屏 `Capture area screenshot`
   - 全屏滚动截屏 `Capture full size screenshot`
   - dom元素截屏 `Capture node screenshot`
   - 截取当前屏幕 `Capture screenshot`
   ![image](https://github.com/littleluckly/blog/blob/master/images/image-20210915080800984.png)



## Console控制台

Api:

-  `$_`返回上一次的语句执行结果
- `$0`返回当前复制的dom元素

工具栏介绍

- console输出类型（error/info/warn/log)

![image-20210917063015882](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210917063015882.png)

- 观察变量变化

![image-20210917063153478](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210917063153478.png)

## JS代码调试

- 通过dom元素断点，找到js部分
  可以监听元素属性变化、子元素变化、元素被移除是的变化

![image-20210917064137692](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210917064137692.png)

- 忽略某个文件

场景：通过断点调试进入了某个第三方库源代码，如果只是希望调试自己编写的代码，忽略源代码部分

![image-20210917064052239](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210917064052239.png)

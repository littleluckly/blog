## 基础命令

> **[root@xxx ~]**

![image-20211008114944492](https://i.loli.net/2021/10/08/MFmqXv7fQYAb1KE.png)

命令窗口中提示的这段命令表示：`[用户名@实例名 当前目录]#`

如果是root用户后面跟着的是 `#`

如果是普通用户后面跟着的是 `$`



>  **`~`和`/`的区别**

`~`指的是当前登录用户的home目录，对于`root`用户来说，home目录指的是`/root`, 其他用户指的是 `/home`，可以通过 `pwd`查看当前的目录

`/`指的是系统的根目录



> **关机和重启**

```
关机
   shutdown -h now        立刻关机
   shutdown -h 5        5分钟后关机
   poweroff            立刻关机
重启
   shutdown -r now        立刻重启
   shutdown -r 5        5分钟后重启
   reboot                立刻重启
```





## 目录操作

> **目录切换 cd**

```
cd /     切换到根目录
cd /usr     切换到根目录下的usr目录
cd ../     切换到上一级目录 或者  cd ..
cd ~     切换到home目录
cd -     切换到上次访问的目录
```



> **目录查看 ls [-al]**

```
ls                查看当前目录下的所有目录和文件
ls -a            查看当前目录下的所有目录和文件（包括隐藏的文件）
ls -l 或 ll       列表查看当前目录下的所有目录和文件（列表查看，显示更多信息）
ls /dir            查看指定目录下的所有目录和文件   如：ls /usr
```



> **创建目录【增】 mkdir**

```
mkdir   aaa       在当前目录下创建一个名为aaa的目录
mkdir   /usr/aaa   在指定目录下创建一个名为aaa的目录
```



> **删除目录或文件【删】rm**

```
命令：rm [-rf] 目录

删除文件：
rm 文件        删除当前目录下的文件
rm -f 文件    删除当前目录的的文件（不询问）

删除目录：
rm -r aaa    递归删除当前目录下的aaa目录
rm -rf aaa    递归删除当前目录下的aaa目录（不询问）

全部删除：
rm -rf *    将当前目录下的所有目录和文件全部删除
rm -rf /*    【自杀命令！慎用！慎用！慎用！】将根目录下的所有文件全部删除

注意：rm不仅可以删除目录，也可以删除其他文件或压缩包，为了方便大家的记忆，无论删除任何目录或文件，都直接使用 rm -rf 目录/文件/压缩包
```



> **目录修改【改】mv 和 cp**

- 重命名目录 `命令：mv 当前目录  新目录`

```
mv aaa bbb    将目录aaa改为bbb
注意：mv的语法不仅可以对目录进行重命名而且也可以对各种文件，压缩包等进行    重命名的操作
```

- 剪切目录 `命令：mv 目录名称 目录的新位置`

```
示例：将/usr/tmp目录下的aaa目录剪切到 /usr目录下面    
mv /usr/tmp/aaa /usr
注意：mv语法不仅可以对目录进行剪切操作，对文件和压缩包等都可执行剪切操作
```

- 拷贝目录 `命令：cp -r 目录名称 目录拷贝的目标位置   -r代表递归`

```
示例：将/usr/tmp目录下的aaa目录复制到 /usr目录下面     
cp /usr/tmp/aaa  /usr
注意：cp命令不仅可以拷贝目录还可以拷贝文件，压缩包等，拷贝文件和压缩包时不    用写-r递归
```



> **搜索目录【查】find**

命令：`find 目录 参数 文件名称`

```
示例：find /usr/tmp -name 'a*'    查找/usr/tmp目录下的所有以a开头的目录或文件
```





## 文件操作

> **新建文件【增】touch**

命令：`touch 文件名`

```
示例：在当前目录创建一个名为aa.txt的文件     touch  aa.txt
```



> **删除文件 【删】 rm**

命令：`rm -rf 文件名`



> **修改文件【改】 vi或vim**

vim编辑器有3种模式， 分别是:

- 命令模式（command mode），使用 `vim 文件名`打开文件后，自动进入命令模式，在该模式下使用 `i` 命令进入插入模式，即文件修改模式；

```
命令行模式下的常用命令：
	【1】控制光标移动：↑，↓，j
  【2】删除当前行：dd 
  【3】查找：/字符
  【4】进入编辑模式：i o a
  【5】进入底行模式：:
```

- 插入模式（Insert mode），即修改文件内容的模式，修改完之后，按 `Esc`键退出插入模式，进入底行模式；
- 底行模式（last line mode），该模式下可以输入保存命令

```
底行模式下常用命令：
	【1】退出编辑：   :q
	【2】强制退出：   :q!
	【3】保存并退出：  :wq
```

  



# 压缩文件操作

>  打包和压缩

Windows的压缩文件的扩展名  .zip/.rar

linux中的打包文件：aa.tar    

linux中的压缩文件：bb.gz   

linux中打包并压缩的文件：.tar.gz

Linux中的打包文件一般是以.tar结尾的，压缩的命令一般是以.gz结尾的。

而一般情况下打包和压缩是一起进行的，打包并压缩后的文件的后缀名一般.tar.gz。

命令：`tar -zcvf 打包压缩后的文件名 要打包的文件`

```
	z：调用gzip压缩命令进行压缩
  c：打包文件
  v：显示运行过程
  f：指定文件名

示例：
打包并压缩/dir_test目录下的所有文件 压缩后的压缩包指定名称为first.tar.gz	
tar -zvcf first.tar.gz /dir_test/*
打包并压缩当前目录下的指定两个文件a.txt b.txt 打包后名称问second.tar.gz
tar -zvcf second.tar.gz a.txt b.txt
```



> 解压

命令：`tar [-zxvf] 压缩的文件 -C 解压后的目录 `  



## 查找

> **find**

find命令在目录结构中搜索文件，并对搜索结果执行指定的操作。 

示例：

```
find . -name "*.log" -ls  在当前目录查找以.log结尾的文件，并显示详细信息。 
find /root/ -perm 600   查找/root/目录下权限为600的文件 
find . -type f -name "*.log"  查找当目录，以.log结尾的普通文件 
find . -type d | sort   查找当前所有目录并排序 
find . -size +100M  查找当前目录大于100M的文件
```



> grep

```shell
[root@root ~]# cat /root/bin/hello.sh  // 使用cat命令可以将目标文件内容打印在控制台上
#!/bin/bash
echo hello~~~~~
[root@root ~]# cat /root/bin/hello.sh | grep hello  // 配合grep可以找出hello，并打印在控制台上
echo hello~~~~~
```

![image-20211009094207409](https://i.loli.net/2021/10/09/dIarKNtj6ZUVzPb.png)
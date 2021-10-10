Shell 是一个命令解释器，它通过接受用户输入的 Shell 命令来启动、暂停、停止程序的运行或对计算机进行控制。

shell 是一个应用程序，它连接了用户和 Linux 内核，让用户能够更加高效、安全、低成本地使用 Linux 内核。

shell 可以直接调用 linux 命令

shell脚本编写注意事项：

- 开头添加 bash路径`#!/bin/bash`

  不同服务器的bash路径不一致，可以先通过 命令`whereis bash`获取正确的bash路径

- 命名建议规则：变量名大写、局部变量小写、函数名小写、名字体现实际作用

- 变量默认全局，在函数中的变量用local指定为局部变量，避免污染其他作用域

- `set -e`遇到执行非0时退出脚本，`set -x`打印执行过程



## shell基础

> echo 输出

```shell
echo 'hello' // 输出hello
echo -e 'hello\tworld' // \t会被转义成一个制表符（8个空格）
	-e ：表示输出转义字符
```



> 编写脚本文件`hello.sh`

- 新建文件`touch hello.sh`

```shell
#!/bin/bash  // 第一行指定解释器
echo hello
```

- 执行shell脚本文件

```shell
sh hello.sh // 执行脚本文件，输出hello
```



> 配置别名 alias

命令：`alias 别名=“原始命令”`

配置别名示例:`alias ls="ls -a"`，如此配置的别名只是临时生效

如果要永久有效，则需要把别名写入home目录的`.bashrc`文件中

```shell
vim ~/.bashrc //打开配置文件，添加一条别名alias ls="ls -a"
```

<img src="https://i.loli.net/2021/10/08/gY8u3J9b5oy1VUl.png" alt="image-20211008153340388" style="zoom:50%;" />



配置好之后并不会立即生效, 还需要额外执行`source ~/.bashrc`或者 `. ~/.bashrc`

删除别名 `unalias 别名`



> 快捷键

| 命令              | 说明                 |
| ----------------- | -------------------- |
| ctrl+c、command+c | 强制终止当前命令     |
| ctrl+l、command+l | 清屏                 |
| ctrl+a、command+a | 移动光标到行首       |
| ctrl+e、command+e | 移动光标到行尾       |
| ctrl+u、command+u | 从光标位置删除到行首 |

> 多命令执行符

| 执行符      | 格式           | 作用                              | 示例             |
| ----------- | -------------- | --------------------------------- | ---------------- |
| `;`         | 命令1;命令2    | 没有逻辑关系，多命令执行          | echo 1;echo 2    |
| `&&`        | 命令1&&命令2   | 和js逻辑一致                      | echo 1&&echo2    |
| `||`        | 命令1\|\|命令2 | 和js逻辑一致                      | echo 1\|\|echo 2 |
| `|`管道符号 | 命令1\|命令2   | 命令1的执行结果作为命令的操作对象 | ls /etc \| more  |



> 特殊符号

| 符号       | 作用                                   | 示例                          |
| ---------- | -------------------------------------- | ----------------------------- |
| 单引号     | 显示单纯的字符串                       | echo '$PATH'  输出一个字符串  |
| 双引号     | 一些特殊字符由特定含义                 | echo "$PATH"  输出所有bin路径 |
| 反引号\`\` | 反引号包裹的是系统命令，会执行系统命令 | echo \`ls\`  会执行ls命令     |
| $()        | 和反引号效果一致                       |                               |
| #          | 注释                                   |                               |
| $          | 调用变量的值                           |                               |
| \          | 转义符号                               |                               |





## 变量

变量有自定义变量和环境变量之分，自定义的变量属于局部变量，环境变量属于全局变量。

局部变量仅在当前shell脚本中生效，全局变量在当前shell脚本和它的子shell中生效。

环境变量也可以自定义

#### 自定义变量

注意：变量赋值的=前后不能有空格

> 变量类型

字符串

整型

浮点型

> **定义变量**

默认是字符串类型

```shell
name=hello // 定义变量
echo $name   // 调用变量
echo "$name" // 调用变量  注意单引号不行
echo ${name} // 调用变量
```

> **删除变量**

`unset 变量名`

> ##### 查询变量

查询已经定义生效的变量 

- `set`，普通查找，返回所有变量
- `set | grep name` 查找指定变量

#### 环境变量

> ##### 自定义环境变量

`export 变量名=变量值`

```shell
// 定义环境变量
export name=我是全局的环境变量
// 使用变量
echo $name
// 测试在子shell中是否能够获取到该命令
bash // 开启子shell
echo $name
exit // 退出子shell
```



> ##### 系统环境变量

| 变量名     | 作用                                                | 示例           |
| ---------- | --------------------------------------------------- | -------------- |
| HOSTNAME   | 主机名                                              | echo $HOSTNAME |
| SHELL      | 当前的shell                                         |                |
| HISTSIZE   | 历史命令条数                                        |                |
| SSH_CLIENT | 当前操作环境如果是用SSH连接的话，这里会记录客户端IP |                |
| USER       | 当前登录用户                                        |                |
| PATH       | 系统搜索路径，即所有可执行命令所在的bin目录         | echo $PATH     |



> ##### 添加全局可执行命令

示例：添加一个全局可执行命令`hello.sh`

**方法一：**

将shell脚本移动到一个已存在的bin目录

1. `vim hello.sh`创建一个脚本`hello.sh`，将内容修改为如下：

```shell
#!/bin/bash
echo hello~~~~
```

2. 查找bin路径， 找到当前用户的bin目录

通过$PATH找到当前用户bin目录为 `/root/bin`

```shell
[root@root ~]# echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin // 输出多个bin目录，用符号:分割，全局执行命令会按照这是个顺序取查找命令对应的脚本。

```

3. 如果当前没有`/root/bin`目录，则需要创建 该目录`mkdir /root/bin/`

4. 将脚本 `hello.sh`移动到 目录`/root/bin`
5. 更改权限，此时hello.sh脚本还不是一个可执行文件，需要修改权限，将其改为可执行文件

`cd /root/bint/;chmod +x hello`

6. 一顿操作后就可以在任意地方使用命令 `hello.sh`

**方法二**

新建shells目录，管理所有shell脚本，并将shells目录添加过到环境变量PATH中

1. 新建shells目录 `mkdir /root/shells;cd /root/shells`
2. 新建shell脚本 `hello2.sh`， 同样通过`vim hello2.sh`将内容改为

```shell
#!/bin/bash
echo hello2~~~~
```

3. 修改权限 `chmod +x hello2.sh`

4. 将shells目录添加过到环境变量PATH中 

   - 方式1：添加临时环境变量：` export PATH="$PATH":/root/shells`

   - 方式2：添加永久环境变量：

     - 编辑环境配置文件`vim ~/.bash_profile`
     - 添加`$HOME/shells`

     ![image-20211009101423539](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20211009101423539.png)

     - 生效`source ~/.bash_profile`

5. 测试验证 `hello2.sh`



> ##### 位置参数

执行shell脚本时，传给给脚本的参数，通过特殊的表达式取获取

| 变量 | 作用                                                         |
| ---- | ------------------------------------------------------------ |
| $n   | n是数字，$0代表命令本身，$1-9代表第1到第9个参数，10以上的参数需要用大括号获取，如${10} |
| $*   | 代表脚本命令执行时传入的所有参数                             |
| $@   | 也代表脚本命令执行时传入的所有参数，会对每个参数进行区分     |
| $#   | 脚本命令执行时传入的所有参数个数                             |



> ##### 预定义变量

- $? 上一次命令的执行结果，正确执行则返回0，否则返回其他

- $$ 当前进程的PID  

  `echo $$` 输出当前进程PID



#### 环境变量配置文件

> ##### **配置文件说明**

linux中有几种不同的配置文件

| 配置文件路径    | 说明                                          |
| --------------- | --------------------------------------------- |
| /etc/profile    | 系统变量，对所有用户生效，针对所有种类的shell |
| /etc/bashrc     | 系统变量，对所有用户生效，针对bash            |
| ~/.bash_profile | 用户变量，对当前登录用户生效                  |
| ~/.bashrc       | 用户变量，对当前登录用户生效                  |

![image-20211009101830862](https://i.loli.net/2021/10/09/hwUJAC849yplOLE.png)

> ##### `source`命令或`.`

修改配置文件后，需要注销重新登录才能够生效，使用source命令可以是配置文件立马生效

格式： `source 配置文件`或者 `. 配置文件`

## 运算符



> ##### declare声明变量类型

变量默认类型是字符串，可以通过declare指定变量类型

用法： `declare [+/-] [选项] 变量名`

| 选项 | 作用                                           |
| ---- | ---------------------------------------------- |
| -    | 给变量设定类型属性                             |
| +    | 取消变量的类型属性                             |
| -a   | 声明数组类型变量                               |
| -i   | 声明整数型变量                                 |
| -x   | 声明环境变量                                   |
| -r   | 声明只读变量                                   |
| -p   | 显示指定变量的被声明的类型，用于显示变量的类型 |

```shell
[root@root shells]# a=1
[root@root shells]# b=2
[root@root shells]# echo $a+$b
1+2
[root@root shells]# declare -i c=$a+$b // 声明整数型
[root@root shells]# echo $c
3
[root@root shells]# declare +i c=$a+$b // 取消类型
[root@root shells]# echo $c
1+2
[root@root shells]# declare -i c="3"
[root@root shells]# declare -p c
declare -i c="3"
[root@root shells]# declare -x kk=1 // 声明环境变量，效果等同于export kk=1，export其实只是一个语法糖，最终也是执行的declare -x
[root@root shells]# set | grep kk   // 查询所有变量
_=kk=1
kk=1
[root@root shells]# env | grep kk   // 查询环境变量
kk=1
[root@root ~]# declare -a names     // 声明一个数组类型
[root@root ~]# names[0]=zhangsan    // 数组赋值
[root@root ~]# names[1]=lisi				// 数组赋值
[root@root ~]# echo $names					// 注意$names默认取的是数组第一项的值
zhangsan
[root@root ~]# echo $names[1]				// $names[1]相当于$names+字符串的[1]
zhangsan[1]
[root@root ~]# echo ${names[1]}			// 用大括号才能表示第一项
lisi
[root@root ~]# echo ${names[*]}     // 数组所有项
zhangsan lisi
```



> ##### 数值运算

- 使用`$((表达式))`

```shell
[root@root ~]# num1=1
[root@root ~]# num2=2
[root@root ~]# echo $(($num1+$num2))
3

```

- 使用 `$[ 表达式 ]` ，注意中括号前后的空格！

```shell
[root@root ~]# num1=1
[root@root ~]# num2=2
[root@root ~]# echo $[$num1+$num2]
3
```



- 声明数值类型 `declare -i`

```shell
[root@root ~]# num1=1
[root@root ~]# num2=2
[root@root ~]# declare -i c=$num1+$num2
[root@root ~]# echo $c
3

```

- expr 关键字

```shell
[root@root ~]# num1=1
[root@root ~]# num2=2
[root@root ~]# echo $(expr $num1 + $num2)  // 特别注意：符号+两侧都要有空格才行

```







## 文本处理

> ##### 正则



> ##### cut切割

类似于js的split

用法：`cut [选项] [文件名]`

选项说明：

- -f 列号，用来指定要提取的列号
- -d分隔符，按指定分隔符分割文件内容，默认按制表符分割

示例：提示用户名和使用的shell

`cat /etc/passwd | cut -f 1,7 -d :` 或者`cut -f 1,7 -d : /etc/passwd` 



> awk



> sed



## 流程控制

> ##### 文件类型判断

| 选项 | 含义                         |
| ---- | ---------------------------- |
| -d   | 是否存在并且是目录           |
| -e   | 文件是否存在                 |
| -f   | 文件是否存在并且是普通文件   |
| -b   | 文件是否存在并且是设备文件   |
| -c   | 文件是否存在并且是字符设备   |
| -L   | 文件是否存在并且是连接文件   |
| -p   | 文件是否存在并且是管道文件   |
| -s   | 文件是否存在并且是非空       |
| -S   | 文件是否存在并且是套接字文件 |



```shell
[root@root dir_test]# ls
a.txt
[root@root dir_test]# test -e a.txt && echo '存在'||echo '不存在'  // test -e 文件名 判断文件是否存在
存在
[root@root dir_test]# test -e b.txt && echo '存在'||echo '不存在'
不存在
[root@root dir_test]# [ -e a.txt ]  && echo '存在'||echo '不存在'  // 也可以使用中括号的方式
存在
[root@root dir_test]# [ -e b.txt ]  && echo '存在'||echo '不存在'  // 也可以使用中括号的方式
不存在

```



> ##### 文件权限判断

| 选项 | 含义                               |
| ---- | ---------------------------------- |
| -r   | 文件是否存在，并且是否拥有读权限   |
| -w   | 文件是否存在，并且是否拥有写权限   |
| -x   | 文件是否存在，并且是否拥有执行权限 |
|      |                                    |

```shell
[root@root dir_test]# ll
-rw-r--r--   1 root root    0 10月  8 13:41 a.txt
[root@root dir_test]# [ -r a.txt ] && echo  '可读' || echo  '不可读'
可读
[root@root dir_test]# [ -w a.txt ] && echo  '可写' || echo  '不可写'
可写
[root@root dir_test]# [ -x a.txt ] && echo  '可执行' || echo  '不可执行'
不可执行
[root@root dir_test]# chmod u+x a.txt // 设置可写权限+x
[root@root dir_test]# [ -x a.txt ] && echo  '可执行' || echo  '不可执行'
可执行

```



> ##### 整数之间的比较

```shell
[root@root dir_test]# [ 2 -eq 2 ] && echo 'equal' || 'not equal'  // -eq判断是否相等
equal
[root@root dir_test]# [ 2 -eq 20 ] && echo 'equal' ||echo  'not equal'
not equal
[root@root dir_test]# [ 2 -ne 20 ] && echo 'not equal' || echo 'equal' // -ne 判断不相等
not equal
// 其他的判断
// gt 大于
// lt 小于
// ge 大于等于
// le 小于等于

```



> ##### 字符串之间的比较

四种比较方式 

-  空`-z`
- 非空 `-n`
- 相等 `==`
- 不相等 `!=`

```shell
[root@root dir_test]# [ -n 'a' ] && echo '非空' || echo '空字符串'
非空
[root@root dir_test]# [ -z 'a' ] && echo '空字符串' || echo '非空'
非空
[root@root dir_test]# [ 'a' == 'a' ] && echo '相等' || echo '不相等'
相等
[root@root dir_test]# [ 'a1' != 'a' ] && echo '不相等' || echo '相等'
不相等

```



> ##### 逻辑运算

三种逻辑

- `-a` 逻辑与
- `-o `逻辑或
- `!`逻辑非

```shell
[root@root dir_test]# [ 'a' == 'a' -a 'a' == 'a' ] && echo '相等' || echo '不相等'
相等
[root@root dir_test]# [ 'a1' != 'a' -o 'a' == 'a' ] && echo '不相等' || echo '相等'
不相等
[root@root dir_test]# [ ! 'a' == 'a' ] && echo '相等' || echo '不相等'
不相等
# test 'a' == 'a'  && echo '相等' || echo '不相等' // 相等
```



> ##### 单分支if条件语句

三种用法

- then不换行

```shell
if [ 条件判断 ];then
	代码体
fi

# 示例
user=$(whoami)
if [ "$user" == root ];then
echo '当前登录的是root'
fi

```

- 省略分号，then换行

```shell
if [ 条件判断 ]
then
	代码体
fi
```

- fi不换行，带省略号

```shell
if [ 条件判断 ]; then 代码体; fi
```



> ##### 双分支if

```shell
# 示例
read -p "请输入一个路径" dir
# -d 判断是否是一个目录
if [ -d "$dir" ];then
	echo "$dir是一个目录"
else
	echo "$dir不是一个目录"
fi

```



> ##### 多分支if

```shell
read -p "请输入一个分数" score
if [ "$score" -ge 90 ];then
	echo "优秀"
elif [ "$score" -ge 80 ];then
	echo "良好"
else
	echo "合格"
fi

```



> case语句

用法：

```
case 变量名 in
值1)
  代码快1
  ;;
值2)
  代码快2
  ;;
*)
  代码快3
  ;;
esac
```

示例：

```shell
# 示例
read -p "请输入yes或no____" choice
case $choice in
'yes')
  echo '是'
  ;;
'no')
  echo '否'
  ;;
*)
  echo '其他'
  ;;
esac

```



> ##### for循环

用法1：

```
for 变量 in 值1 值2 值3
do
代码快
done
```

示例：

```shell
for i in 1 2 3
do
echo $i
done
```

用法2：

```shell
for((j=1;j<=10;j++));  # ((表达式))  表达式里的符号不需要转义
do
  echo $(($j)); # 数学运算：$((数学表达式))
done
```



> ##### while循环

用法：

```
while [ 条件表达式 ]
do
  代码块
done
```

示例：

```shell
i=1;
result=0
while [ $i -le 100 ]
do
	# result=$[ $result+$i ] # 中括号前后必须有空格
  result=$(($result+$i))   # $((数学表达式))，其效果和$[ 数学表达式 ]是一样的
  i=$(($i+1))
done
echo "$result"

```



> 函数

函数定义可以不带function关键字，也可以带function关键字，函数调用不需要带圆括号。

函数如果需要传参，则通过$n的方式获取，n是数字，$1-9代表第1到第9个参数，10以上的参数需要用大括号获取，如${10}

```shell
function start(){
	echo 'start function'
}
# 也可以不带function关键字
start2(){
	echo 'start2 function'
}
# 函数调用不需要带圆括号
start
start2

function sum(){ 
local result=$(($1+$2)) # 变量默认全局，在函数中的变量用local指定为局部变量，避免污染其他作用域
echo $result 
return $result
}
echo $?  # $?打印上一个命令的执行结果

```


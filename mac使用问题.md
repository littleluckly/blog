## No Xcode or CLT version detected!解决办法

具体办法：
输入`xcode-select --print-path`查看 command-line tools 的安装路径，不出意外显示的结果应该是/Library/Developer/CommandLineTools

输入sudo rm -r -f /Library/Developer/CommandLineTools把 command-line tools 从系统移除掉（输入密码）

最后输入xcode-select --install重新安装

安装完成



## 常用快捷键

隐藏程序坞：*option+command+D*

刷新网页：*option+command+R*

强制退出应用程序：*option+command+Esc*
快速搜索访问某个程序：*command+空格*

打开多个终端：command+N



## Xcode

#### 1. 报错：`xcode-select: error: tool 'xcodebuild' requires Xcode`

1. 执行`sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer/` 切换到当前Xcode路径下
2. 执行`xcodebuild -showsdks`
3. 执行`xcrun --sdk iphoneos --show-sdk-path`



## 文件权限

#### 获取当前文件及目录所有权限


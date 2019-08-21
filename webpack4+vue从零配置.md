# webpack4+vue 开发环境的搭建

---

#### 1.建立文件夹，初始化一个 package.json 文件用来管理依赖包。

执行`mkdir myapp`和`npm init -y`
进入项目目录后新建如下目录结构：

- build 打包相关配置
- dist 打包生成的文件存放目录
- public 静态资源目录
- src 主代码目录

---

#### 2.安装需要的依赖项

安装开发环境依赖项目，执行`npm install webpack webpack-cli vue-loader vue-style-loader vue-template-compiler @babel/core @babel/preset-env babel-loader clean-webpack-plugin copy-webpack-plugin css-loader postcss-loader file-loader html-webpack-plugin style-loader less less-loader mini-css-extract-plugin sass-resources-loader webpack-dev-server webpack-merge --save-dev`
安装运行依赖，执行`npm install vue --save`

下面介绍一下每个依赖项的作用

> **wepack、 webpack-cli、 webpack-dev-server、 webpack-merge：** 不需要解释
>
> **vue-loader、 vue-template-compiler：** 解析和转换 .vue 文件,提取出其中的逻辑代码 script、样式代码 style、以及 HTML 模版 template,再分别把它们交给对应的 Loader 去处理
>
> **@babel/core、 @babel/preset-env、 babel-loader** 为了能够使用 es6 es7 的语法
>
> **clean-webpack-plugin** 每次重新打包之前清空打包目录
>
> **copy-webpack-plugin** 把不需要经过打包处理的静态资源复制到打包目录
>
> **html-webpack-plugin** 打包时自动生成 html
>
> **less、 less-loader** 解析 less 语法
>
> **sass-resources-loader** 解决 less 全局变量样式加载问题， 解决了全局样式文件在每个文件中手动@import 引入的繁琐问题
>
> **mini-css-extract-plugin** 将 CSS 提取为独立的文件，需要注意的是在生产环境下不需要再使用 stye-loader、vue-style-loader 了，否则打包报错！

---

#### 3.编写入口文件`main.js`和`App.vue`

在 src 目录下新建文件 App.vue

```
<template>
    <div id="app">asdfasdfsadf</div>
</template>
```

在根目录下新建入口文件`main.js`

```
import Vue from "vue"
import App from "./src/App.vue"

new Vue({
  el: "#app",
  render: h => h(App)
})

```

---

#### 4.新建模板文件 index.html

根目录新建 index.html, 内容如下：

```
<!DOCTYPE html>
<html>
  <head>
    <title>webpack4+vue项目架构</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0"
    />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>

```

---

#### 5 编写 webpack 配置文件

在 build 文件夹下新建 3 个文件 webpack.base.conf.js、webpack.dev.conf.js、webpack.prod.conf.js
此时项目结构为

```
build
    |webpack.base.conf.js
    |webpack.dev.conf.js
    |webpack.prod.conf.js
dist
public
src
    |App.vue
main.js
index.html
```

webpack.base.conf.js 内容如下:

```
const path = require("path")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const HTMLWebpackPlugin = require("html-webpack-plugin")
// 此处要注意新版本的clean-webpack-plugin要通过{}的方式引入，且实例传参也发生了变化
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports = {
    // 项目入口文件
    entry: path.resolve(__dirname, `../main.js`),
    // 打包生成的文件存储目录
    output: {
        filename: "js/[name].[hash:8].js",
        path: path.resolve(__dirname, "../dist")
    },
    module: {
        rules: [
        {
            test: /\.vue$/, // 处理vue模块
            use: "vue-loader"
        },
        {
            test: /\.js$/,//处理es6 es7语法
            exclude: "/node_modules/",
            use: {
            loader: "babel-loader",
            options: {
                presets: [
                [
                    "@babel/preset-env",
                    {
                    targets: {
                        browsers: ["> 1%", "last 2 versions"]
                    }
                    }
                ]
                ]
            }
            }
        },
        {
            test: /\.(png|svg|jpg|gif)$/, // 处理图片
            use: {
            loader: "file-loader" // 解决打包css文件中图片路径无法解析的问题
            }
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/, // 处理字体
            use: {
            loader: "file-loader"
            }
        }
        ]
    },
    plugins: [
        new VueLoaderPlugin(), //加载解析.vue文件
        // 以模板文件生成index.html
        new HTMLWebpackPlugin({
        template: path.resolve(__dirname, "../index.html") // 模版文件
        }),
        // 打包时清空dist目录
        new CleanWebpackPlugin({
        root: path.resolve(__dirname, "..", "dist"),
        verbose: true, //开启在控制台输出信息
        dry: false
        }),
        // 拷贝favicon等公共文件到dist目录
        new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, "../public"),
            to: path.resolve(__dirname, "../dist"),
            ignore: ["*.html"]
        }
        ])
    ]
}

```

webpack.dev.conf.js 内容如下:

```
const path = require("path")
const baseConfig = require("./webpack.base.js")
const merge = require("webpack-merge")
module.exports = merge(baseConfig, {
  mode: "devlopment",
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "vue-style-loader", // 处理vue文件中的css样式
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          // 这些loader会按照从右到左的顺序处理样式
          "vue-style-loader",
          "css-loader",
          "less-loader",
          "postcss-loader",
          {
            loader: "sass-resources-loader", // 将定义的sass变量、mix等统一样式打包到每个css文件中，避免在每个页面中手动手动引入
            options: {
              resources: path.resolve(__dirname, "../src/styles/common.less")
            }
          }
        ]
      }
    ]
  }
})

```

webpack.prod.conf.js 内容如下:

```
const baseConfig = require("./webpack.base.conf.js")
const merge = require("webpack-merge")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")
module.exports = merge(baseConfig, {
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[chunkhash:8].css" // css最终以单文件形式抽离到 dist/css目录下
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          {
            loader: "sass-resources-loader", // 将定义的less或者sass变量、mix等统一样式打包到每个css文件中，避免在每个页面中手动手动引入
            options: {
              resources: path.resolve(__dirname, "../src/styles/common.less")
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "async", // 控制webpack选择哪些代码块用于分割（其他类型代码块按默认方式打包）。有3个可选的值：initial、async和all。
      minSize: 30000, // 形成一个新代码块最小的体积
      maxSize: 0,
      minChunks: 1, // 在分割之前，这个代码块最小应该被引用的次数（默认配置的策略是不需要多次引用也可以被分割）
      maxAsyncRequests: 5, // 按需加载的代码块，最大数量应该小于或者等于5
      maxInitialRequests: 3, // 初始加载的代码块，最大数量应该小于或等于3
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          // 将所有来自node_modules的模块分配到一个叫vendors的缓存组
          test: /[\\/]node_modules[\\/]/,
          priority: -10 // 缓存组的优先级(priotity)是负数，因此所有自定义缓存组都可以有比它更高优先级
        },
        default: {
          minChunks: 2, // 所有重复引用至少两次的代码，会被分配到default的缓存组。
          priority: -20, // 一个模块可以被分配到多个缓存组，优化策略会将模块分配至跟高优先级别（priority）的缓存组
          reuseExistingChunk: true // 允许复用已经存在的代码块，而不是新建一个新的，需要在精确匹配到对应模块时候才会生效。
        }
      }
    }
  }
})


```

---

#### 6.启动项目测试效果

在`package.json`中添加

```
  "scripts": {
    "dev": "webpack-dev-server --open --mode development --config build/webpack.dev.conf.js",
    "build": "webpack --mode production --config build/webpack.prod.conf.js",
  },
```

运行项目，执行`npm run dev`
打包项目，执行`npm run build`

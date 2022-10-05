# webpack4.x

基于node的模块打包工具



## 安装

1. 环境准备

- nodejs

Webpack4.x版本

```js
// 推荐局部安装
npm i webpack webpack-cli -D
```

## 启动

不添加任何配置也可以启动，webpack4.x有默认的配置

- npx webpack
- Package.json添加脚本script

```js
"build": "webpack"
```



## 配置

- 添加配置文件`webpack.config.js`

```js
const path = require('path')
module.exports = {
  // 入口
  // entry: "./src/index.js",
  entry: {
    main: "./src/index.js",
  },
  // 出口
  output: {
    // 输出打包文件目录，必须是绝对路径，所以此处引入path
    path: path.resolve(__dirname, './dist'),
    filename:'main'
  }
}
```

指定打包配置文件

修改package.json

```js
"mybuild": "webpack --config webpack.my.config.js"
```





## 核心概念

- entry

单页面、多页面

- output

```js
  // 出口
  output: {
    // 输出打包文件目录，必须是绝对路径，所以此处引入path
    path: path.resolve(__dirname, './dist'),
    // 资源名称 占位符
    // [name]
    // [hash:6] 所有打包后的文件hash值都是同一个，只要任何一个文件内容发生变化，hash值就会变化，不利于浏览器的缓存
    // [chunkhash] 
    // [contenthash] 自身内容发生变化，才会更新
    // filename: "main.js",
    filename:'main'
  }
```



- mode
- loader 模块转换器

webpack默认值支持.js .json模块打包，其他类型需要加载对应的loader

如css-loader用来打包css， style-loader用来将css插入到dom中

```js
  module: {
    rules: [
      {
        test: /\.css$/,
        // 多个loader有执行顺序，从后往前执行, 注意webpack4.x搭配style-loader2.x css-loader@4.x
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
    ],
  },
```



- plugin 插件 webpack功能扩展，多个plugin没有执行顺序问题

如html-webpack-plugin, 自动生成index.html

```js
  plugins: [
    // 注意webpack4.x搭配html-webpack-plugin4.x
    new htmlWebpackPlugin({
      template: "./index.html",
      filename: "myindex.html",
    }),
  ],
```



- chunk 代码片段

- module 模块

- bundle 打包输出的资源文件，就叫bundle文件

  一个chunk包含一个或多个模块

  一个chunks包含一个或多个chunk

  一个bundle对应一个chunks

- hash  contenthash  chunkhash



## webpack前端项目工程化实战

按照上文步骤初始项目

1. 初始化package.json`npm init -y`, 并配置script命令

2. 创建webpack.config.js，配置输入输出，mode， html-webpack-plugin，clean-webpack-plugin，css-loader

3. 支持css预处理语言 less

   ```js
   npm i less@4.x less-loader@7.x -D
   ```

4. postcss解决css兼容性问题，如添加浏览器前缀，更多postcss功能参见https://www.postcss.com.cn/

```js
npm i postcss postcss-loader@4.x -D
npm i autoprefixer -D
```

新建postcss.config.js配置文件

```js
module.exports = {
  plugins: [
    require("autoprefixer")({
      // 所有主流浏览器的最近两个版本，市占率>1%
      overrideBrowserslist: ["last 2 versions", ">1%"],
    }),
  ],
};
```

修改webpack.config.js有关css的配置

```js
      {
        test: /\.less/,
        loader: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
```

5. css抽离成单独的文件

安装插件`mini-css-extract-plugin`

修改webpack.config.js， 用miniCssExtractPlugin.loader替换style-loader

```js
const path = require("path");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  entry: {
    index: "./src/index.js",
  },
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
  },
  module: {
    rules: [
      { test: /\.css$/, loader: ["style-loader", "css-loader"] },
      {
        test: /\.less/,
        loader: [
          miniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
    }),
    new CleanWebpackPlugin(),
    new miniCssExtractPlugin({
      filename: "index.css",
    }),
  ],
};
```



自定义loader

创建replace-loader.js

```js
// 不能使用箭头函数, 因为loader的api挂载在this上
// 必须有返回值，或者调用this.callback()
// 异步处理： this.async
module.exports = function (source) {
  // return source.replace("hello", "哇塞");
  // this.query获取loader的参数options
  const callback = this.async(); // 等同于this.callback
  setTimeout(() => {
    callback(null, source.replace("大兄弟", "world"));
  }, 2000);
};

```

修改配置文件引入loader

```js

      {
        test: /\.js$/,
        // use: path.resolve(__dirname, "./myLoaders/replace-loader.js"),
        use: {
          loader: path.resolve(__dirname, "./myLoaders/replace-loader.js"),
          options: {
            name: "xxx",
          },
        },
      },
```

加载自定义loader，引用路径写起来不够简洁，可以配置一下`resolveLoader`

```js
resolveLoader:{
  modules:['node_modules','./myLoaders']
}
```



6. 处理图片

`file-loader`处理图片，配置module

还有一个更强的`url-loader`,可以将小尺寸图片处理成base64

```js
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "images/",
            limit: 1024 * 10, // 10kb一下图片将被处理成base64
          },
        },
      },
```



7. 第三方字体处理

以阿里巴巴普惠体为例, 去官网下载https://www.iconfont.cn/字体, 将字体文件放入项目目录中

在css中配置

```less
@font-face {
  font-family: "webfont";
  font-display: swap;
  src: url("webfont.woff") format("woff");
}
html,
body {
  font-family: webfont;
}

// 疑问：如果使用miniCssExtractPlugin，会导致字体文件引用路径不正确！！！！！
```

webpack中配置

```js
      {
        test: /\.woff2$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "fonts/",
            name: "[name].[ext]",
          },
        },
      },
```



7. 提升开发体验，开启sourcemap

配置devtool

```js
// 
devtool: 'source-map'
```





## 多页面打包方案

思路：借助glob动态读取入口文件，生成多个entry及对应的htmlWebpackPlugin

```js
const path = require("path");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const glob = require("glob");

const setMpa = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, "./src/pages/*/index.js"));
  entryFiles.forEach((pagePath) => {
    const res = pagePath.match(/src\/pages\/(.*)\/index\.js$/);
    const pageName = res[1];
    entry[pageName] = pagePath;
    htmlWebpackPlugins.push(
      new htmlWebpackPlugin({
        template: `./src/pages/${pageName}/index.html`,
        filename: `${pageName}.html`,
        chunks: [pageName],
      })
    );
  });

  return { entry, htmlWebpackPlugins };
};
const { entry, htmlWebpackPlugins } = setMpa();
module.exports = {
  entry,
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]-[chunkhash:6].js",
  },
  module: {
    rules: [
      { test: /\.css$/, loader: ["style-loader", "css-loader"] },
      {
        test: /\.less/,
        loader: [
          // miniCssExtractPlugin.loader,
          "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.js$/,
        // use: path.resolve(__dirname, "./myLoaders/replace-loader.js"),
        use: {
          loader: path.resolve(__dirname, "./myLoaders/replace-loader.js"),
          options: {
            name: "xxx",
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "images/",
            limit: 1024 * 2, // 2kb一下图片将被处理成base64
          },
        },
      },
      {
        test: /\.woff2$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "fonts/",
            name: "[name].[ext]",
          },
        },
      },
    ],
  },
  plugins: [
    ...htmlWebpackPlugins,
    new CleanWebpackPlugin(),
    new miniCssExtractPlugin({
      filename: "css/index-[chunkhash:6].css",
    }),
  ],
};

```



8. 热更新和热模块更新

热更新：相当于自动刷新浏览器

热模块更新：仅仅更新修改的模块内容，相当于局部更新



9. babel 使用下一代js语法

使用方式：配置文件

- .babelrc
- babel.config.js
- package.json
- babel-loader

安装`npm install --save-dev babel-loader @babel/core @babel/preset-env`

配置rules

```js

      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          // options可以挪到.babelrc中
          options: {
            // 预设插件，
            // babel 在v7.4之前的版本只能解决语法问题，一些api的支持还需要额外安装@babel/polyfill，如promise
            // v7.4后推荐手动安装core-js regenerator-runtime,
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    edge: "17",
                    chrome: "67",
                    safari: "11",
                  },
                  // 默认是2, babel-polyfill自带core-js@2.x
                  // 如果是3需要额外安装core-js@3.x
                  corejs: 2,
                  // 按需加载
                  useBuiltIns: "usage",
                },
              ],
            ],
          },
        },
      },
751477
```



## 自定义plugin

plugin就是对webpack的功能扩展

选择一个触发时机，生成某种资源/或者一些操作

webpack打包过程有生命周期，或者钩子

compiler触发某个钩子，cmpilation是当前编译阶段的产物





## webpack打包bundle原理分析与实现

分析原理

执行npx webpack运行的过程

wepack-》config=>打包入口，输出目录=〉入口文件->分析是否有依赖，以及依赖木块的路径->解析处理模块内容（es6+转es5）-》chunk code （缺失函数，require exports）



bundle文件内容：

```js
(function(){
  // 缺失函数补齐
  require
  eval（chunCode）
  exports
})({
  // key=依赖模块入口路径
  // value=模块处理后的内容chunkCode
  
})
```




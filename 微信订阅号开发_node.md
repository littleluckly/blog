# 微信订阅号开发

### 0.准备工作

> 1. 注册购买腾讯云服务器
> 2. 安装[node、pm2](https://github.com/littleluckly/blog/issues/6)
> 3. 注册微信订阅号

### 1.配置和启用微信订阅号

官网入门指引示例所用的后台语言是 python，不熟悉 python 的可以换成自己熟悉的语言，本文使用的是 node

**1.1) 填写服务器地址 url 和 token**
为了能够在本地调试，使用内网穿透工具[ngrok:https://www.ngrok.cc/](https://www.ngrok.cc/)（此工具收费！）。
关于入口购买和使用 ngrok, 可以参考[https://cloud.tencent.com/developer/article/1481429]
进入[微信公众号管理页面](https://mp.weixin.qq.com/)-->找到左侧菜单栏【开发】-【基本配置】-->填写服务器地址 url 和 token。填写后并不能提交，因为还需要再服务器中校验 token
![](https://wojushenzhen-1259597421.cos.ap-guangzhou.myqcloud.com/%E5%BE%AE%E4%BF%A1%E8%AE%A2%E9%98%85%E5%8F%B7%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE)

**1.2) 服务端校验**
服务端采用 node+express 方案，这里不详细展开环境的搭建，唯一需要注意的是订阅号服务只支持 80 端口。
校验逻辑流程图如下：
![](http://mmbiz.qpic.cn/mmbiz_png/PiajxSqBRaEIQxibpLbyuSK9B2CRwJYwMRFbDwdwNicNwcwhWaTuibPIqUwocStP6VicjxyGc2S96XlaNiciagkc26eKg/0?wx_fmt=png)
新建路由文件 wx.js，然后启动 node 服务后(再次强调只能启用 80 端口服务)，再次回到微信公众号管理页面进行提交和启用服务器的配置。完成上述步骤后接下来就可以进行愉快的公众号开发了,

```
var express = require("express")
var router = express.Router()
var db = require("../utils/db")
var crypto = require("crypto")

router.get("/", function(req, res, next) {
  //   console.log(req.query)
  const { signature, timestamp, nonce, echostr } = req.query
  const token = "weixin"

  function check(timestamp, nonce, signature, token) {
    var currSign, tmp
    tmp = [token, timestamp, nonce].sort().join("")
    currSign = crypto
      .createHash("sha1")
      .update(tmp)
      .digest("hex")
    return currSign === signature
  }
  if (check(timestamp, nonce, signature, token)) {
    res.end(echostr)
  } else {
    res.end("It is not from weixin")
  }
})
module.exports = router
```

**1.3) 申请测试号**
由于用户体验和安全性方面的考虑，微信公众号的注册有一定门槛，某些高级接口的权限需要微信认证后才可以获取。
申请地址[https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421137522], 申请步骤和以上步骤一致。

### 2.功能开发：自动回复公众号粉丝信息

**2.1) 接受粉丝发送的消息**
微信服务器收到用户发送的消息，会以 xml 的格式发送到我们自己的服务器。在 express 中要解析 xml 数据需要用到 express-xml-bodyparser，所以我们要先安装依赖`npm install express-xml-bodyparser --save`
修改 wx.js 文件

```
var express = require("express")
var router = express.Router()
var db = require("../utils/db")
var crypto = require("crypto")
const xml2js = require("xml2js")
xmlparser = require("express-xml-bodyparser")

router.get("/", function(req, res, next) {
  console.log("req.query", req.query)
  const { signature, timestamp, nonce, echostr } = req.query
  const token = "weixin"

  function check(timestamp, nonce, signature, token) {
    var currSign, tmp
    tmp = [token, timestamp, nonce].sort().join("")
    currSign = crypto
      .createHash("sha1")
      .update(tmp)
      .digest("hex")
    return currSign === signature
  }
  if (check(timestamp, nonce, signature, token)) {
    res.end(echostr)
  } else {
    res.end("It is not from weixin")
  }
})

// 接收用户发送的消息，并自动回复
router.post("/", xmlparser({ trim: false, explicitArray: false }), function(
  req,
  res,
  next
) {
  const { fromusername, tousername, createtime, msgtype } = req.body.xml
  // 返回给微信服务器的消息格式必须遵循如下格式，content内容可以自定义，\n表示换行
  let data = `<xml>
    <ToUserName>${fromusername}</ToUserName>
    <FromUserName>${tousername}</FromUserName>
    <CreateTime>${createtime}</CreateTime>
    <MsgType>${msgtype}</MsgType>
    <Content>你好啊</Content>
  </xml>`
  res.writeHead(200, { "Content-Type": "application/xml" })
  res.end(data)
})
module.exports = router


```

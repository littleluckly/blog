# 微信订阅号开发

### 0.准备工作

> 1. 注册购买腾讯云服务器
> 2. 安装[python](https://github.com/littleluckly/blog/issues/5)
> 3. 注册微信订阅号

### 1.配置和启用微信订阅号

官网入门指引示例所用的后台语言是 python，不熟悉 python 的可以换成自己熟悉的语言

**1.1) 填写服务器地址 url 和 token**
进入[微信公众号管理页面](https://mp.weixin.qq.com/)-->找到左侧菜单栏【开发】-【基本配置】-->填写服务器地址 url 和 token。填写后并不能提交，因为还需要再服务器中校验 token
![](https://wojushenzhen-1259597421.cos.ap-guangzhou.myqcloud.com/%E5%BE%AE%E4%BF%A1%E8%AE%A2%E9%98%85%E5%8F%B7%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE)

**1.2) 安装[web.py](https://github.com/littleluckly/blog/issues/5), 搭建 python 服务器，校验 token。[参考](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1472017492_58YV5)**

- `wget http://webpy.org/static/web.py-0.37.tar.gz`
- `tar xvfz web.py-0.37.tar.gz`
- `cd web.py-0.37`
- `sudo python setup.py install`

**1.3) 新建文件 main.py**

```
# -*- coding: utf-8 -*-
# filename: main.py
import web
from handle import Handle

urls = (
    '/wx', 'Handle',
)

if __name__ == '__main__':
    app = web.application(urls, globals())
    app.run()
```

**1.4) 新建 handle.py**

```
# -*- coding: utf-8 -*-
# filename: handle.py

import hashlib
import web

class Handle(object):
    def GET(self):
        try:
            data = web.input()
            if len(data) == 0:
                return "hello, this is handle view"
            signature = data.signature
            timestamp = data.timestamp
            nonce = data.nonce
            echostr = data.echostr
            token = "xxxx" #请按照公众平台官网\基本配置中信息填写

            list = [token, timestamp, nonce]
            list.sort()
            sha1 = hashlib.sha1()
            map(sha1.update, list)
            hashcode = sha1.hexdigest()
            print "handle/GET func: hashcode, signature: ", hashcode, signature
            if hashcode == signature:
                return echostr
            else:
                return ""
        except Exception, Argument:
            return Argument
```

**1.5) 启动 main.py**
执行命令`python main.py 80`，回到微信公众号管理页面提交并启用服务器配置。至此已完成服务器配置和启用步骤。

### 2.简单功能实现：自动回复粉丝发送的消息

功能：粉丝给公众号一条文本消息，公众号立马回复一条文本消息给粉丝，不需要通过公众平台网页操作。
**2.1) 接受文本消息**
新增 receive.py 文件，解析微信服务器传递过来的 xml 数据

```
# -*- coding: utf-8 -*-
# filename: receive.py
import xml.etree.ElementTree as ET

def parse_xml(web_data):
    if len(web_data) == 0:
        return None
    xmlData = ET.fromstring(web_data)
    msg_type = xmlData.find('MsgType').text
    if msg_type == 'text':
        return TextMsg(xmlData)
    elif msg_type == 'image':
        return ImageMsg(xmlData)

class Msg(object):
    def __init__(self, xmlData):
        self.ToUserName = xmlData.find('ToUserName').text
        self.FromUserName = xmlData.find('FromUserName').text
        self.CreateTime = xmlData.find('CreateTime').text
        self.MsgType = xmlData.find('MsgType').text
        self.MsgId = xmlData.find('MsgId').text

class TextMsg(Msg):
    def __init__(self, xmlData):
        Msg.__init__(self, xmlData)
        self.Content = xmlData.find('Content').text.encode("utf-8")

class ImageMsg(Msg):
    def __init__(self, xmlData):
        Msg.__init__(self, xmlData)
        self.PicUrl = xmlData.find('PicUrl').text
        self.MediaId = xmlData.find('MediaId').text
```

**2.2) 被动回复文本消息**
被动回复消息，即发送自动回复粉丝发送的消息，不同于客服消息接口。
新建 reply.py

```
# -*- coding: utf-8 -*-
# # filename: reply.py
import time

class Msg(object):
    def __init__(self):
        pass
    def send(self):
        return "success"

class TextMsg(Msg):
    def __init__(self, toUserName, fromUserName, content):
        self.__dict = dict()
        self.__dict['ToUserName'] = toUserName
        self.__dict['FromUserName'] = fromUserName
        self.__dict['CreateTime'] = int(time.time())
        self.__dict['Content'] = content
    def send(self):
        XmlForm = """
        <xml>
        <ToUserName><![CDATA[{ToUserName}]]></ToUserName>
        <FromUserName><![CDATA[{FromUserName}]]></FromUserName>
        <CreateTime>{CreateTime}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[{Content}]]></Content>
        </xml>
        """
        return XmlForm.format(**self.__dict)

class ImageMsg(Msg):
    def __init__(self, toUserName, fromUserName, mediaId):
        self.__dict = dict()
        self.__dict['ToUserName'] = toUserName
        self.__dict['FromUserName'] = fromUserName
        self.__dict['CreateTime'] = int(time.time())
        self.__dict['MediaId'] = mediaId

    def send(self):
        XmlForm = """
        <xml>
        <ToUserName><![CDATA[{ToUserName}]]></ToUserName>
        <FromUserName><![CDATA[{FromUserName}]]></FromUserName>
        <CreateTime>{CreateTime}</CreateTime>
        <MsgType><![CDATA[image]]></MsgType>
        <Image>
        <MediaId><![CDATA[{MediaId}]]></MediaId>
        </Image>
        </xml>
        """
        return XmlForm.format(**self.__dict)
```

**2.3) 修改 handle.py 文件**

```
# -*- coding: utf-8 -*-
# filename: handle.py

import hashlib
import web
import reply
import receive

class Handle(object):
    def GET(self):
        try:
            data = web.input()
            if len(data) == 0:
                return "hello, this is handle view"
            signature = data.signature
            timestamp = data.timestamp
            nonce = data.nonce
            echostr = data.echostr
            token = "helloworld" #请按照公众平台官网\基本配置中信息填写

            list = [token, timestamp, nonce]
            list.sort()
            sha1 = hashlib.sha1()
            map(sha1.update, list)
            hashcode = sha1.hexdigest()
            print "handle/GET func: hashcode, signature: ", hashcode, signature
            if hashcode == signature:
                return echostr
            else:
                return ""
        except Exception, Argument:
            return Argument

    def POST(self):
        try:
            webData = web.data()
            print "Handle Post webdata is ", webData
   #后台打日志
            recMsg = receive.parse_xml(webData)
            if isinstance(recMsg, receive.Msg) and recMsg.MsgType == 'text':
                toUser = recMsg.FromUserName
                fromUser = recMsg.ToUserName
                content = "hello world"
                replyMsg = reply.TextMsg(toUser, fromUser, content)
                return replyMsg.send()
            else:
                print "暂且不处理"
                return "success"
        except Exception, Argment:
            return Argment
```

**测试**：拿出手机，微信扫描公众号二维码, 向订阅号发送消息。
至此已经完成自动回复粉丝发送文本消息的功能。

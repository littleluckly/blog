# 腾讯云 cos 上传之---web 端直传

开篇前的废话，本人作为前端菜鸟，刚开始对腾讯云文件上传一头雾水，甚至连文档都看不明白，途中一度想要放弃！在疯狂的百度，疯狂的翻阅文档下，历经艰辛最后形成了本文。

> 完整的参考地址： https://github.com/tencentyun/cos-js-sdk-v5/tree/master/dist
>
> 服务端代码参考地址： https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/sts.js
>
> web 端代码参考地址： https://github.com/tencentyun/cos-js-sdk-v5/blob/master/demo/sts-post.html
>
> 临时密钥生成 参考地址：https://cloud.tencent.com/document/product/436/14048

#### 1.上传之前的准备工作

- 1.开通对象存储服务，并建立存储桶 在存储桶列表中找到**Bucket**（即存储同名称）和**Region**（即所属地域）地址：https://console.cloud.tencent.com/cos5,
- 2.点击存储桶名称进入存储桶管理页，找到基础配置，在基础配置中添加跨域访问 cors 规则
- 3.开通 API 云密钥管理服务，获取 SecretId 和 SecretKey。地址：https://console.cloud.tencent.com/cam/capi
- 4.下载计算签名的库 (cos-auth.min.js)： https://github.com/tencentyun/cos-js-sdk-v5/blob/master/demo/common/cos-auth.min.js

#### 2.编写 web 端代码

主要分成二个步骤：

- 计算签名，签名需要用到临时密钥 tmpSecretId，tmpSecretKey。临时密钥放到服务端生成。
- 采用表单上传的方式，将文件上传到腾讯云，上传的地址为：`protocol + "//" + Bucket + ".cos." + Region + ".myqcloud.com/"`

废话少讲，直接上代码：

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Ajax Post 上传</title>
    <style>
      h1,
      h2 {
        font-weight: normal;
      }

      #msg {
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <h1>Ajax Post 上传</h1>

    <input id="fileSelector" type="file" />
    <input id="submitBtn" type="submit" />

    <div id="msg"></div>

    <script src="../plugins/jquery.js"></script>
    <script src="../plugins/cos-auth.js"></script>
    <script>
      ;(function() {
        // 请求用到的参数
        var Bucket = "wojushenzhen-1259597421"
        var Region = "ap-guangzhou"
        var protocol = location.protocol === "https:" ? "https:" : "http:"
        // 文件上传地址
        var prefix =
          protocol + "//" + Bucket + ".cos." + Region + ".myqcloud.com/"

        // 计算签名
        var getAuthorization = function(options, callback) {
          $.ajax({
            method: "post",
            url: "http://127.0.0.1:9528/upload/getCredential",
            success: function(res) {
              if (res) {
                var credentials = res.credentials
                callback(null, {
                  XCosSecurityToken: credentials.sessionToken,
                  Authorization: CosAuth({
                    SecretId: credentials.tmpSecretId,
                    SecretKey: credentials.tmpSecretKey,
                    Method: options.Method,
                    Pathname: options.Pathname
                  })
                })
              }
            },
            error: function(err) {
              callback("获取签名出错")
            }
          })
        }

        // 上传文件
        var uploadFile = function(file, callback) {
          // 设置Key值，用来指定要上传的文件名称和存储目录
          // 比如要把文件上传到test目录，那么首先应该在存储桶中建立新建test的文件夹
          // 同时在服务端生成临时密钥时，要把policy属性下的resource属性也设置成test
          var Key = "test/" + file.name
          getAuthorization({ Method: "POST", Pathname: "/" }, function(
            err,
            info
          ) {
            var fd = new FormData()
            fd.append("key", Key)
            fd.append("Signature", info.Authorization)
            fd.append("Content-Type", "")
            info.XCosSecurityToken &&
              fd.append("x-cos-security-token", info.XCosSecurityToken)
            fd.append("file", file)
            var xhrOnProgress = function(fun) {
              xhrOnProgress.onprogress = fun //绑定监听
              //使用闭包实现监听绑
              return function() {
                //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
                var xhr = $.ajaxSettings.xhr()
                //判断监听函数是否为函数
                if (typeof xhrOnProgress.onprogress !== "function") return xhr
                //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
                if (xhrOnProgress.onprogress && xhr.upload) {
                  xhr.upload.onprogress = xhrOnProgress.onprogress
                }
                return xhr
              }
            }
            // 对上传的文件名称编码，用来拼接上传后的文件资源路径
            var camSafeUrlEncode = function(str) {
              return encodeURIComponent(str)
                .replace(/!/g, "%21")
                .replace(/'/g, "%27")
                .replace(/\(/g, "%28")
                .replace(/\)/g, "%29")
                .replace(/\*/g, "%2A")
            }
            $.ajax({
              method: "post",
              url: prefix,
              data: fd,
              processData: false,
              contentType: false,
              xhr: xhrOnProgress(function(e) {
                var percent =
                  Math.round((e.loaded / e.total) * 10000) / 100 + "%"
                console.log("上传进度：", percent)
              }),
              success: function(res) {
                // 上传文件资源路径：prefix + camSafeUrlEncode(Key).replace(/%2F/g, "/")
                window.open(prefix + camSafeUrlEncode(Key).replace(/%2F/g, "/"))
              }
            })
          })
        }

        // 监听表单提交
        document.getElementById("submitBtn").onclick = function(e) {
          var file = document.getElementById("fileSelector").files[0]
          if (!file) {
            document.getElementById("msg").innerText = "未选择上传文件"
            return
          }
          file &&
            uploadFile(file, function(err, data) {
              console.log(err || data)
              document.getElementById("msg").innerText = err
                ? err
                : "上传成功，ETag=" + data.ETag
            })
        }
      })()
    </script>
  </body>
</html>

```

#### 3.服务端的代码实现

服务端选用的是 node+express，相比较前端代码，服务端实现相对而言比较简单，只需要采用的是 COS STS SDK 生成临时密钥，发送给前端即可。本人当初卡在权限策略 policy 的配置上，policy 的 resource 即允许前端上传的路径，这个路径和前端上传时的 Key 相关联。

```
const express = require("express")
const router = express.Router()
// 利用qcloud-cos-sts获取临时密钥
const STS = require("qcloud-cos-sts")
// 获取临时密钥
// https://github.com/tencentyun/cos-js-sdk-v5
// https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/sts.js
router.post("/getCredential", function(req, res, next) {
  // 配置参数
  var config = {
    secretId: "AKIDinlaWMqEkssoZ9Av7M1a4QbawRejRiV7",
    secretKey: "ZjiT9VhpmX8SfhS1kKk2A8wfEONFxVs4",
    proxy: "",
    durationSeconds: 1800,
    bucket: "wojushenzhen-1259597421",
    region: "ap-guangzhou",
    // ！！这里allowPrefix要前端上传时的 Key相匹配，否则上传会报403权限错误，如果要上传到存储桶到根目录，设置为*
    allowPrefix: "test/*",
    // 密钥的权限列表
    allowActions: [
      // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
      // 简单上传
      "name/cos:PutObject",
      "name/cos:PostObject",
      // 分片上传
      "name/cos:InitiateMultipartUpload",
      "name/cos:ListMultipartUploads",
      "name/cos:ListParts",
      "name/cos:UploadPart",
      "name/cos:CompleteMultipartUpload"
    ]
  }

  // 获取临时密钥
  var LongBucketName = config.bucket
  var ShortBucketName = LongBucketName.substr(0, LongBucketName.indexOf("-"))
  var AppId = LongBucketName.substr(LongBucketName.indexOf("-") + 1)
  var policy = {
    version: "2.0",
    statement: [
      {
        action: config.allowActions,
        effect: "allow",
        resource: [
          "qcs::cos:" +
            config.region +
            ":uid/" +
            AppId +
            ":prefix//" +
            AppId +
            "/" +
            ShortBucketName +
            "/" +
            config.allowPrefix
        ]
      }
    ]
  }
  //   获取临时签名 SecretId SecretKey
  var startTime = Math.round(Date.now() / 1000)
  STS.getCredential(
    {
      secretId: config.secretId,
      secretKey: config.secretKey,
      proxy: config.proxy,
      region: config.region,
      durationSeconds: config.durationSeconds,
      policy: policy
    },
    function(err, tempKeys) {
      if (tempKeys) tempKeys.startTime = startTime
      res.send(err || tempKeys)
    }
  )
})
module.exports = router

```

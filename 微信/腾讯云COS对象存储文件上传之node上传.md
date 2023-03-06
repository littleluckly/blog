# 腾讯云 COS 对象存储文件上传之 node 上传

本文简单介绍如何在 node 端把文件上传到腾讯云，[官方文档](https://cloud.tencent.com/document/product/436/8629)
采用 node 端上传的方式，使用的是永久密钥，上传过程非常的简单，但是这种方式前端无法实时获取上传进度！
下篇介绍如何在前端直接上传文件到腾讯云。
前端直接上传不能采用本文这种永久密钥的方式，因为把永久密钥放到前端代码中有极大的泄露风险，所以只能采用临时密钥的方式

##### 1.开通腾讯云对象存储服务，并创建存储桶

创建存储桶后，在存储桶列表中可以找到**Bucket**（即存储同名称）和**Region**（即所属地域），region 格式形如：`ap-guangzhou`。这两个属性在上传时会用到。

##### 2.安装 node 端 SDK

`npm install cos-nodejs-sdk-v5 --save`

##### 3.开通 API 云密钥管理服务，获取 SecretId 和 SecretKey

进入 https://console.cloud.tencent.com/cam/capi, 开通密钥服务并新建密钥，新建密钥后在密钥列表中就能找到**APPID**、**SecretId**、**SecretKey**

##### 4.上传

服务端代码：

```
const path = require("path")
var express = require("express")
var multer = require("multer")
var router = express.Router()
let upload = multer({ dest: path.join(__dirname, "../public/upload/") })
const COS = require("cos-nodejs-sdk-v5")

router.post("/upload", upload.any(), function(req, res, next) {
  const file = req.files[0]
  // SecretId 和 SecretKey的获取参见第三步
  let cos = new COS({
    SecretId: "xxxx",
    SecretKey: "xxxx"
  })
  const Bucket = "xxx-xxx" //腾讯云对象储存桶名
  const Region = "ap-guangzhou" //对象储存你所处的地区编号，比如广州

  // 分片上传
  cos.sliceUploadFile(
    {
      Bucket,
      Region,
      Key: file.originalname,
      FilePath: file.path,
      onProgress: function(progressData) {
        var percent = parseInt(progressData.percent * 10000) / 100
        var speed = parseInt((progressData.speed / 1024 / 1024) * 100) / 100
        console.log(
          JSON.stringify(progressData),
          "进度：" + percent + "%; 速度：" + speed + "Mb/s;"
        )
      }
    },
    function(err, data) {
      if (!err) {
        res.send(JSON.stringify({ code: 200, status: "ok" }))
      } else {
        res.send(JSON.stringify({ status: "err" }))
      }
    }
  )
})
```

前端代码：

```
<form id="uploadForm" enctype="multipart/form-data">
    文件:<input id="uploadInput" type="file" name="file" />
</form>
<script src="../plugins/jquery.js"></script>
<script>
    $(function() {
        $("#uploadInput").change(function() {
            var formData = new FormData($("#uploadForm")[0])
            $.ajax({
                method: "post",
                url: "http://127.0.0.1:9528/upload",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function(res) {
                    console.log("res", res)
                },
                error: function(err) {
                    console.log("err", err)
                }
            })
        })
    })
</script>
```

#### 开启服务器配置
登录微信公众号之后，左侧菜单有基本配置，点击之后，页面显示公众号开发信息，下方是服务器配置。

![](https://api.w3xm.top/media/images/c/cc4302fb0af8e29465aa7695f6d6e57985307e961.png)

##### 参数说明：
**服务器地址：** 你自己的服务器URL，当用户对你的公众号发送消息，微信服务器会把消息转发到这个URL，并等待回复，然后把消息转发给用户。

**令牌：** 用于验证过程，配置URL需要验证，你在这里随意设置一个字符串，在你的服务器上按照公众平台开发手册给出的验证过程生成加密字符串和微信服务器发送过去的数据对比，因为token只有你自己知道，所以做一个双向认证。

**消息加密解密密钥：** 一个字符串用于加密消息的处理，这个参数需要开启消息加密才有效。

**消息加密方式：** 默认为明文模式，否则就要设置·消息加密解密密钥·对收到的消息解密然后再处理，回复时也要先加密处理。


配置服务器以后，用户关注，取消关注，点击菜单等事件也会通知服务器，这可以用于一些自动回复，数据更新，日志记录等。

##### 服务器配置的验证过程
填写开发者配置信息后，微信服务器会发送GET请求到服务器URL，GET请求会携带以下参数：

| 参数 | 描述 |
| ------ | ------- |
| signature | 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。 |
| timestamp | 时间戳 |
| nonce | 随机数 |
| echostr | 随机字符串 |

开发者通过检验signature对请求进行校验。生成signature的方式：
1. 将token、timestamp、nonce三个参数进行字典序排序
2. 将三个参数字符串拼接成一个字符串进行sha1加密
3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信

这是微信开发者文档给出的验证方式，微信服务器也按找此方时生成signature。

后端实现是语言无关的，采用任何开发语言都可以。接下来给出NodeJS的处理过程。

**NodeJS处理过程**
``` JavaScript
const ant = require('ant-army');
const crypto = require('crypto');

ant.get('/wx/talk', (req, res) => {

    var token = 'msgtalk';

    var get_str = [
        req.GET['nonce'], req.GET['timestamp'], token
    ];

    get_str.sort();  //字典排序
    var onestr = get_str.join(''); //拼接成字符串
    
		//生成sha1签名字符串
    var hash = crypto.createHash('sha1');
    var sign = hash.update(onestr);
		
    if (req.GET['signature'] === sign.digest('hex')) {
        res.send(req.GET['echostr']);
    } else {
        res.send('');
    }
});

ant.run('localhost', 8192);

```
注意这里使用了ant-army框架，使用其他框架或者原生库都不影响核心的验证处理过程。在回调函数中是核心的处理过程，获取GET参数使用了req.GET，这个是框架提供的，使用其他框架更换即可。
注意最后的运行，微信服务器验证不支持IP地址以及端口号，需要使用已经备案的域名。这里监听本地8192端口，是因为服务器运行了Nginx提供其他服务，而如果此时NodeJS监听80端口以及443端口都会出现问题。这个问题的解决是通过Nginx进行反向代理解决的，配置如下：
``` Nginx
server {
    listen 80;
    server_name wx.d5h5.com;
		
    location / {
        proxy_pass          http://localhost:8192;
        proxy_set_header    Host      $host;
        proxy_set_header    X-Real-IP $remote_addr;
    }
}
```

开启服务器配置以后，就要把接收请求的类型改为POST，并把处理代码改为被动回复消息的代码。URL验证与消息被动回复是互斥的。

#### **access_token**

access_token是公众号的全局唯一接口调用凭据，**公众号调用各接口时都需使用access_token。**access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。

#### **获取access_token的条件**

获取access_token需要两个信息：AppID、AppSecret。根据AppID和AppSecret获取access_token，然后使用access_token调用接口。

登录微信公众号，在基本配置项中，有公众号开发信息。这里AppSecret是不显示的，你可以点击重置获取新的AppSecret，注意要自己保存好AppSecret，微信公众号不再存储，忘记AppSecret只能重置获取新的。

登录测试号是可以直接看到AppID和AppSecret的。但是要注意，在公众号开发信息中还有一项是IP白名单。这一项在正式发布的环境中是必须要设置的，否则调用接口获取access_token会失败。


#### **如何获取access_token**

请求接口：
```
请求类型：GET
请求接口：https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
```
**参数说明：**

![](https://api.w3xm.top/media/images/q/q87b9c1d91c41b3b9d10cc6de43fd74a9240e92c7.png)

**正确调用的返回值**
```
{"access_token":"ACCESS_TOKEN","expires_in":7200}
//expires_in表示有效时间，单位为秒
```

**错误的返回值**

```
{"errcode":40013,"errmsg":"invalid appid"}
```


使用AppID以及AppSecret构造请求接口参数，通过https的请求客户端调用获取access_token。

**这里给出的示例使用了个人开发的一些库，可以使用自己擅长的工具，不必严格按照示例。**

#### NodeJS获取access_token示例
``` JavaScript
//ant-http是一个简单的http/https客户端请求库，可以使用npm i ant-http安装
const anthttp = require('ant-http');

var appid = '你的APPID';
var appsecret = '你的APPSECRET';

var token_api = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;

anthttp.get(token_api, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

```

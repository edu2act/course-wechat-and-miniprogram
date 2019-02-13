### 创建带参数二维码图片

``` JavaScript

const anthttp = require('ant-http');
const fs = require('fs');
const wxcall = require('./weixinApiCall.js');

wxcall()
.then(r => {
    var qrcode_api = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${r.access_token}`;

    var post_data = `{"expire_seconds": 60000, "action_name": "QR_LIMIT_STR_SCENE", "action_info": {"scene": {"scene_str": "helo_1001"}}}`;

    anthttp.post(qrcode_api, {
        data : post_data,
        headers : {
            'Content-Type'  : 'text/plain'
        }
    }, (err, data) => {
        if (err) {
            throw err;
        } else {
            var ret = JSON.parse(data);
            if (ret.ticket === undefined) {
                throw data;
            }

            console.log('二维码URL：', ret.url);
            var down_qrcode_api = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(ret.ticket)}`;

            anthttp.downStream(down_qrcode_api, {
                method : 'GET',
                target : 'qrcode_60000s.jpeg'
            }, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('ok');
                }
            });
        }
    });
})
.catch(e => {
    console.log(e);
});

```

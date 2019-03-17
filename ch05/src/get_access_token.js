const awyhttp = require('awyhttp');

var appid = '你的APPID';
var appsecret = '你的APPSECRET';

var token_api = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;

awyhttp.get(token_api).then(data => {
    console.log(data);
}, err => {
    console.log(err);
});
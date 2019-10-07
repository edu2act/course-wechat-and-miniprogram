const titbit = require('titbit');
const crypto = require('crypto');
const parsexml = require('xml2js').parseString;
const wxmsg = require('./weixinmsg');

var app = new titbit();

var {router} = app;

//用于验证过程，在公众号验证通过后则不会再使用。
router.get('/wx/msg', async c => {
    var token = 'msgtalk';

    var urlargs = [
        c.query.nonce,
        c.query.timestamp,
        token
    ];

    urlargs.sort();  //字典排序

    var onestr = urlargs.join(''); //拼接成字符串
    
	//生成sha1签名字符串
    var hash = crypto.createHash('sha1');
    var sign = hash.update(onestr);
		
    if (c.query.signature === sign.digest('hex')) {
        c.res.body = c.query.echostr;
    }
});



//公众号开发者配置验证并启用后，会通过POST请求转发用户消息。
router.post('/wx/msg', async c => {
    try {
        var xmlmsg = await new Promise((rv, rj) => {
            parsexml(c.body, {explicitArray : false}, (err, result) => {
                if (err) {
                    rj(err);
                } else {
                    rv(result.xml);
                }
            });
        });
        var data = {
            touser      : xmlmsg.FromUserName,
            fromuser    : xmlmsg.ToUserName,
            msg         : xmlmsg.Content,
            msgtime     : parseInt(Date.now() / 1000),
            msgtype     : ''
        };

        c.res.body = wxmsg.msgDispatch(xmlmsg, data);
    } catch (err) {
        console.log(err);
    }

});

app.run(8192, 'localhost');

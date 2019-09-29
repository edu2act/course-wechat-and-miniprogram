const titbit = require('titbit');
const crypto = require('crypto');
const parsexml = require('xml2js').parseString;

var app = new titbit();

var {router} = app;

function formatTpl(data) {

    //尽管只处理文本消息，这样写的目的是为了后续添加更多的消息类型。
    switch(data.msgtype) {
        case 'text':
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[${data.msg}]]></Content>
                    <CreateTime>${data.msgtime}</CreateTime>
                </xml>
            `;

        default: ;
    }
}

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

        var data = {};
        if (xmlmsg.MsgType == 'text') {
            data = {
                touser      : xmlmsg.FromUserName,
                fromuser    : xmlmsg.ToUserName,
                msg         : xmlmsg.Content,
                msgtime     : parseInt(Date.now() / 1000),
                msgtype     : 'text'
            };
            c.res.body = formatTpl(data);
        }
    } catch (err) {
        console.log(err);
    }

});

app.run(8192, 'localhost');

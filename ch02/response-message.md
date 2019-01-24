#### **实现文本消息被动回复**
现在我们先来实现文本消息原样回复，根据消息格式，只需要把FromUserName以及ToUserName互换作为回复消息的数据即可。

**NodeJS代码示例**
``` JavaScript
const ant = require('ant-army');
const crypto = require('crypto');
const parsexml = require('xml2js').parseString;

ant.config.daemon = true;

function formatTpl(data, msgtype) {

    switch(msgtype) {
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

ant.post('/wx/talk', (req, res) => {

    parsexml(req.POST, (err, result) => {
        if (err) {
            console.log(err);
            res.send('');
        } else {
            var xmlmsg = result.xml;
            if (xmlmsg.MsgType == 'text') {
                var data = {
                    touser      : xmlmsg.FromUserName,
                    fromuser    : xmlmsg.ToUserName,
                    msg         : xmlmsg.Content,
                    msgtime     : parseInt((new Date()).getTime() / 1000)
                };
                var textMsg = formatTpl(data, 'text');
                res.end(textMsg);
            } else {
                res.end('');
            }
        }
    });
});

ant.ants('localhost', 8192);

```

监听本地8192端口，并使用Nginx作为反向代理服务器，这在开启服务器配置一节已经讲过。


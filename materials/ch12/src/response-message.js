const awy = require('awy');
const parsexml = require('xml2js').parseString;

var ant = new awy();

ant.config.daemon = true;

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

ant.post('/wx/talk', async rr => {

    await new Promise((rv, rj) => {
        parsexml(rr.req.GetBody(), {explicitArray : false}, (err, result) => {
            if (err) {
                rr.res.Body = '';
                throw err;
            } else {
                var xmlmsg = result.xml;
                if (xmlmsg.MsgType == 'text') {
                    var data = {
                        touser      : xmlmsg.FromUserName,
                        fromuser    : xmlmsg.ToUserName,
                        msg         : xmlmsg.Content,
                        msgtime     : parseInt((new Date()).getTime() / 1000),
                        msgtype     : 'text'
                    };
                    rv( formatTpl(data) );
                } else {
                    rv('');
                }
            }
        });
    }).then((data) => {
        rr.res.Body = data;
    }).catch(err => {
        console.log(err);
    });

});

//这里请把端口换成自己服务器反向代理的端口号
ant.ants('localhost', 8192);

const awy = require('awy');
const parsexml = require('xml2js').parseString;

var ant = new awy();

//开启守护进程模式
ant.config.daemon = true;

function formatTpl(data) {
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

        case 'image':
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[image]]></MsgType>
                    <CreateTime>${data.msgtime}</CreateTime>
                    <Image><MediaId><![CDATA[${data.msg}]]></MediaId></Image>
                </xml>
            `;
            
        case 'voice':
            return ` 
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[voice]]></MsgType>
                    <CreateTime>${data.msgtime}</CreateTime>
                    <Voice><MediaId><![CDATA[${data.msg}]]></MediaId></Voice>
                </xml>
            `;

        case 'video':
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[video]]></MsgType>
                    <CreateTime>${data.msgtime}</CreateTime>
                    <Video>
                        <MediaId><![CDATA[${data.msg}]]></MediaId>
                        <ThumbMediaId><![CDATA[${data.thumb}]]></ThumbMediaId>
                    </Video>
                </xml>
            `;

        default: 
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[该类行不被支持]]></Content>
                    <CreateTime>${data.msgtime}</CreateTime>
                </xml>
            `;
    }
}

function help() {
    return `这是一个消息回复测试程序，会把消息原样返回，但是目前不支持视频音频类型的消息`;
}

function userMsgHandle(xmsg, retmsg) {
    /*
        检测是否为文本消息，如果是文本消息则先要检测是不是支持的关键词回复。
    */
    if (xmsg.MsgType == 'text') {
        if (xmsg.Content == 'help' || xmsg.Content == '?' || xmsg.Content == '？') {

            retmsg.msg = help();
            retmsg.msgtype = 'text';
            return formatTpl(retmsg);

        } else if (xmsg.Content == 'hello' || xmsg.Content == '你好'){

            retmsg.msg = '你好，你可以输入一些关键字测试消息回复，输入help/?获取帮助';
            retmsg.msgtype = 'text';
            return formatTpl(retmsg);

        } else {

            retmsg.msg = xmsg.Content;
            retmsg.msgtype = xmsg.MsgType;
            return formatTpl(retmsg);

        }
    } else {
        switch(xmsg.MsgType) {
            case 'text':
                retmsg.msg = xmsg.Content;
                retmsg.msgtype = 'text';
                break;
            case 'image':
            case 'voice':
            //case 'video':
                retmsg.msg = xmsg.MediaId;
                retmsg.msgtype = xmsg.MsgType;
                break;
            default:
                retmsg.msg = '不支持的类型';
        }

        return formatTpl(retmsg);
    }

}

function preMsgHandle(xmsg, retmsg) {
    if (xmsg.MsgType == 'event') {
        //暂时不处理事件消息
    } else {
        return userMsgHandle(xmsg, retmsg);
    }
}

ant.post('/wx/talk', async (rr) => {
    //输出收到的消息用于观察测试
    console.log(rr.req.GetBody());

    await new Promise((rv, rj) => {
    
        parsexml(rr.req.GetBody(), {explicitArray : false}, (err, result) => {
            if (err) {
                rr.res.Body = '';
                throw err;
            } else {
                var xmlmsg = result.xml;
                var retmsg = {
                    touser      : xmlmsg.FromUserName,
                    fromuser    : xmlmsg.ToUserName,
                    msgtime     : parseInt((new Date()).getTime() / 1000),
                    msgtype     : ''
                };

                var msgdata = preMsgHandle(xmlmsg, retmsg);
                rv(msgdata);
            }
        });
    }).then(data => {
        rr.res.Body = data;
    }).catch(err => {
        console.log(err);
    });

});

ant.ants('localhost', 8192);

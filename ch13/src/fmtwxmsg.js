module.exports = function formatMsg (data) {
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
};
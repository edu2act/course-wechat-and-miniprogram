const awy = require('awy');
const crypto = require('crypto');

var ar = new awy();

ar.get('/wx/talk', async rr => {
    var token = 'msgtalk';

    var get_str = [
        rr.req.GetQueryParam('nonce', ''), 
        rr.req.GetQueryParam('timestamp',''), 
        token
    ];

    get_str.sort();  //字典排序
    var onestr = get_str.join(''); //拼接成字符串
    
	//生成sha1签名字符串
    var hash = crypto.createHash('sha1');
    var sign = hash.update(onestr);
		
    if (rr.req.GetQueryParam('signature') === sign.digest('hex')) {
        rr.res.Body = rr.req.GetQueryParam('echostr');
    }
});

ar.run('localhost', 2020);
/*
本地测试：
curl 'https://localhost:2020/wx/talk?signature=561f18d897b08a1d5d5633e03ac9899cc1018ac2&echostr=4701824731143159513&timestamp=1546397393&nonce=1536243785'
*/

const awyhttp = require('awyhttp');
const wxcall = require('./weixinToken.js');

/**
 * 下载图片素材的示例程序，
 * 你应该把media_id换成你自己上传素材的media_id。
*/

wxcall.getToken()
.then(ret => {
    if (!ret.status) {
        throw ret.data;
    }
    
    var download_media = `https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=${ret.data}`;

    return awyhttp.download(download_media, {
        method : 'POST',
        data : {
            //换成你自己的素材MEDIA_ID
            media_id : '上传图片素材返回的MEDIA_ID'
        },
        headers : {
            'Content-Type' : 'text/plain'
        },
        target : './test.jpg'
    });

}, err => {
    throw err;
})
.then(ret => {
    console.log('ok');
}, err => {
    throw err;
})
.catch(err => {
    console.log(err);
});

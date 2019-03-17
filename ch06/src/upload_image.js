const awyhttp = require('awyhttp');
const fs = require('fs');
const wxcall = require('./weixinToken.js');

var image_name = '45678.jpg';
var image_path = './' + image_name;

wxcall.getToken()
.then(ret => {
    if (!ret.status) {
        throw ret.data;
    }

    var upload_api = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${ret.data}&type=image`;

    return awyhttp.upload(upload_api, {
        file : image_path,
        upload_name : 'media'
    });

}, err => {
    throw err;
})
.then(ret => {
    console.log(ret);
    var r = JSON.parse(ret.data);
    if (r.errcode === undefined) {

        //要保存的文件路径
        var media_path = './' + r.media_id;
        
        //获取的结果添加filename属性
        r.filename = image_name;

        //把获取的结果保存到文件
        fs.writeFile(media_path, JSON.stringify(r), {encoding:'utf8'}, err => {
            console.log(err);
        });
    }
    
}, err => {
    throw err;
})
.catch(err => {
    console.log(err);
});

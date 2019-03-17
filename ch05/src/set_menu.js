const awyhttp = require('awyhttp');

var appid = '你的APPID';
var appsecret = '你的APPSECRET';

var token_api = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;

var menu_data = {
    button : [
        {
            name : "科技",
            sub_button : [
                {
                    name : "Linux",
                    type : "view",
                    url  : "https://www.linux.org/"
                },
                {
                    name : "NodeDoc",
                    type : "view",
                    url  : "https://nodejs.org/dist/latest-v10.x/docs/api/"
                },
                {
                    name : "awy",
                    type : "view",
                    url  : "https://awy.linuslinux.com"
                },

            ]
        },
        {
            name : "发图",
            type : "pic_weixin",
            key  : "my-image"
        },
        {
            name : "功能",
            sub_button : [
                {
                    name : "关于我们",
                    type : "click",
                    key  : "about-us"
                },

            ]
        }
        
    ]
};

awyhttp.get(token_api).then(data => {
    var ret = JSON.parse(data);
    if (ret.errcode !== undefined) {
        throw ret.errmsg;
    } else {
        return ret;
    }
}, err => {
    throw err;
}).catch(err => {
    console.log(err);
}).then(ret => {
    var json_menu = JSON.stringify(menu_data);

    var create_menu_api = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${ret.access_token}`;

    return awyhttp.post(create_menu_api, {
        data : json_menu,
        headers : {
            'Content-Type'  : 'text/plain'
        }
    }).then(data => {
        console.log(data);
    }, err => {
        console.log(err);
    });
});

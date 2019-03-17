const awyhttp = require('awyhttp');
const fs = require('fs');
const wxcall = require('./weixinToken.js');
const pg = require('pg');
const dbconfig = require('./dbconfig.js');

var image_name = '45678.jpg';
var image_path = './' + image_name;

//初始化postgres连接
var pgc = new pg.Client(dbconfig);
pgc.connect();

/**
示例程序：创建媒体素材，并写入数据库,数据库使用了postgres
需要安装postgres扩展： npm i pg

Posetgres数据库需要创建表：
create table wx_media(id serial primary key, media_id char(60), media_url text not null default '', media_type char(10) not null default '');

MySQL创建表：
create table wx_media(id int not null primary key auto_increment, media_id char(60), media_url text not null default '', media_type char(10) not null default '');

常见的数据库扩展以支持回调居多，如果要把回调改成链式调用需要使用Promise。


*/

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
    var r = JSON.parse(ret.data);
    if (r.errcode === undefined) {
        var sql = "INSERT INTO wx_media(media_type, media_id, media_url) "
                +"VALUES ($1, $2, $3)";
        var values = ['image', r.media_id, r.url];

        return new Promise((rv, rj) => {
            pgc.query(sql, values, (err, result) => {
                if (err) {
                    rv({
                        apiret : r,
                        dberr  : err
                    });
                } else {
                    rv({
                        dbret : result,
                        wxret : r
                    });
                }
            });
        });
    } else {
        return {
            wxret : r,
            dbret : null
        };
    }
    
}, err => {
    throw err;
})
.then(ret => {
    if (ret.dberr) {
        console.log(ret.dberr.stack);
    } else {
        console.log(ret.dbret);
    }

    console.log(ret.wxret);
})
.catch(err => {
    console.log(err);
}).finally (() => {
    pgc.end();
});

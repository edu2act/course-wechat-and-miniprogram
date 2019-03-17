const awyhttp = require('awyhttp');
const fs = require('fs');
var wxkey = require('./weixinkey.js');

module.exports = new function () {

    var the = this;

    this.token_api = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxkey.appid}&secret=${wxkey.appsecret}`;
    this.token_path = '/tmp/access_token.save';

    this.getToken = function() {
        return new Promise((rv, rj) => {
            fs.readFile(the.token_path, {encoding:'utf8'}, (err, data) => {
                if (err) {
                    rv(null);
                } else {
                    var t = JSON.parse(data);
                    var now_tm = (new Date()).getTime();
                    if (parseInt(t.get_time) + parseInt(t.expires_in) > parseInt(now_tm/1000)) {
                        rv(t.access_token);
                    } else {
                        rv(null);
                    }
                }
            });
        }).then(data => {
            if (data) {
                return {
                    status : true,
                    data : data
                };
            }

            return awyhttp.get(the.token_api)
                .then(data => {
                    var ret = JSON.parse(data);
                    if (ret.errcode === undefined) {
                        ret.get_time = parseInt((new Date()).getTime()/1000);
                        fs.writeFile(the.token_path, 
                            JSON.stringify(ret),
                            {encoding:'utf8'},(err) => {
                            }
                        );
                        
                        return {
                            status : true,
                            data : ret.access_token
                        };
                    } else {
                        return {
                            status : false,
                            data   : data
                        };
                    }
                }, err => {
                    throw err;
                });
        }, err => {
            throw err;
        });
    };

};


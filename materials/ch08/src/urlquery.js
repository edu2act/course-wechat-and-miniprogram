const http = require('http');
const url = require('url');

http.createServer((req, res) => {

    //true表示默认解析querystring
    let urlobj = url.parse(req.url, true);

    console.log(urlobj);
    
    res.end('ok');
})
.listen(8080, 'localhost');

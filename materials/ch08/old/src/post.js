const http = require('http');
const qs = require('querystring');

http.createServer((req, res) => {
    let body = '';
    let hasBody = false;

    if(req.method == 'POST' || req.method == 'PUT') {
        hasBody = true;
        req.on('data', (data) => {
            //仅仅处理了文本类型，并转换成utf8编码，对于上传文件来说，比较复杂，需要根据协议格式进行解析处理。
            body += data.toString('utf8');
        });
    } else {
        req.on('data', (data) => {});
    }

    req.on('end', () => {
        if (hasBody) {
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                //处理默认表单提交的参数格式：a=1&b=2····
                //解析成JSON对象
                console.log(qs.parse(body));
            }
            res.end(body);
        } else {
            res.end('ok');
        }
    });
})
.listen(8080, 'localhost');

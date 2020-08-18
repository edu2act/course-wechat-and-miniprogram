const http = require('http');
const url = require('url');
const qs = require('querystring');

var router = function () {
    if (!(this instanceof router)) {return new router();}

    this.routeTable = {
        'GET'   : {},
        'POST'  : {},
        'PUT'   : {},
        'DELETE'  : {},
        'OPTIONS' : {}
    };

    this.addPath = function (method, path, callback) {
        this.routeTable[method][path] = callback;
    };

    this.get = function (path, callback) {
        this.addPath('GET', path, callback);
    };

    this.post = function (path, callback) {
        this.addPath('POST', path, callback);
    };

    this.put = function (path, callback) {
        this.addPath('PUT', path, callback);
    };

    this.delete = function (path, callback) {
        this.addPath('DELETE', path, callback);
    };

    this.options = function (path, callback) {
        this.addPath('OPTIONS', path, callback);
    };

    this.findPath = function (method, path) {
        if (!this.routeTable[method]) {
            return null;
        }
        if (this.routeTable[method][path]) {
            return this.routeTable[method][path];
        }
        return null;
    }

}

async function coreRequest(ctx, callback) {
    let rawBody = '';
    if (ctx.method == 'GET' || ctx.method == 'OPTIONS') {
        ctx.request.on('data', (d) => {});
    } else {
        ctx.request.on('data', data => {
            rawBody += data.toString('utf8');
        });
    }

    ctx.request.on('end', async () => {
        if (rawBody.length > 0) {
            if (ctx.headers['content-type'] === 'application/x-www-form-urlencoded') {
                ctx.body = qs.parse(rawBody);
            } else {
                ctx.body = rawBody;
            }
        }
        await callback(ctx);
    });
}


var R = new router();

R.get('/', async (c) => {
    c.response.end('ok');
});

R.post('/', async c => {
    c.response.end(JSON.stringify(c.body));
});


http.createServer((req, res) => {

    let ctx = {
        url      : null,
        method   : req.method,
        path     : '',
        headers  : req.headers,
        body     : '',
        query    : {},
        request  : req,
        response : res,
        res      : {
            body : ''
        },
    };

    let urlobj = url.parse(req.url, true);
    ctx.path = urlobj.pathname;
    ctx.query = url.query;
    ctx.url = urlobj;

    let callback = R.findPath(ctx.method, ctx.path);
    if (callback === null) {
        res.statusCode = 404;
        res.end();
        return ;
    }

    coreRequest(ctx, callback);
})
.listen(8080, 'localhost');

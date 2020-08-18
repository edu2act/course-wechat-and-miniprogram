const http = require('http');
const url = require('url');
const qs = require('querystring');

var myhttp = function () {
    if (!(this instanceof myhttp)) {return new myhttp();}
    var self = this;

    this.router = {};

    this.router.routeTable = {
        'GET'   : {},
        'POST'  : {},
        'PUT'   : {},
        'DELETE'  : {},
        'OPTIONS' : {}
    };

    this.router.addPath = function (method, path, callback) {
        self.router.routeTable[method][path] = callback;
    };

    this.router.get = function (path, callback) {
        self.router.addPath('GET', path, callback);
    };

    this.router.post = function (path, callback) {
        self.router.addPath('POST', path, callback);
    };

    this.router.put = function (path, callback) {
        self.router.addPath('PUT', path, callback);
    };

    this.router.delete = function (path, callback) {
        self.router.addPath('DELETE', path, callback);
    };

    this.router.options = function (path, callback) {
        self.router.addPath('OPTIONS', path, callback);
    };

    this.router.findPath = function (method, path) {
        if (!self.router.routeTable[method]) {
            return null;
        }
        if (self.router.routeTable[method][path]) {
            return self.router.routeTable[method][path];
        }
        return null;
    }

    this.coreRequest = async function (ctx, callback) {
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
    };

    this.run = function (port, host='0.0.0.0') {
        var self = this;
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
        
            let callback = self.router.findPath(ctx.method, ctx.path);
            if (callback === null) {
                res.statusCode = 404;
                res.end();
                return ;
            }
        
            self.coreRequest(ctx, callback);
        })
        .listen(port, host);
    };
    
};

module.exports = myhttp;

const myhttp = require('./myhttp');

var app = new myhttp();

app.router.get('/', async (c) => {
    c.response.end('ok');
});

app.router.post('/', async c => {
    c.response.end(JSON.stringify(c.body));
});

app.run(8080, 'localhost');

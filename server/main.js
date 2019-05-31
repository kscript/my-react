'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var fs = _interopDefault(require('fs.promised'));
var path = _interopDefault(require('path'));
var Router = _interopDefault(require('koa-router'));
var serve = _interopDefault(require('koa-static'));
var bodyParser = _interopDefault(require('koa-bodyparser'));

const config = {
    port: 12301,
    template: '/public/index.html',
    publicUrl: '/dist/'
};
const app = new Koa();
const router = new Router();
const index = fs.readFileSync(path.join(process.cwd(), config.template), 'utf8');

let writed = false;
const writeFile = async () => {
    let dir = path.join(process.cwd(), config.publicUrl);
    if (!writed) {
        writed = !!1;
        let exists = await fs.exists(dir);
        if (!exists){
            fs.mkdir(dir);
        }
        await fs.writeFile(path.join(dir, 'index.html'), index);
    }
    await fs.readFile(path.join(dir, 'index.html'), 'utf8');
};
writeFile();

app.use(bodyParser({}));
app.use(serve(
    path.join(process.cwd(), config.publicUrl),
    {}
));

router.get('/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.type = 'html';
    ctx.response.body = await fs.readFile(path.join(process.cwd(), config.publicUrl, name + '.html'), 'utf8');
});

router.get('/', async (ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = await writeFile();
});

app.use(router.routes());

app.listen(config.port);
console.log('');
console.log('http://localhost:' + config.port);
console.log('');

import Koa from 'koa';
import fs from 'fs.promised';
import path from 'path';
import Router from 'koa-router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser'

const config = {
    port: 12301,
    publicUrl: '/dist/'
};

const app = new Koa();
const router = new Router();

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
    ctx.response.body = await fs.readFile(path.join(process.cwd(), 'public', 'index.html'), 'utf8');
});

app.use(router.routes());

app.listen(config.port);
console.log('');
console.log('http://localhost:' + config.port);
console.log('');

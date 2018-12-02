"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const KoaRouter = require('koa-router')();
const apiRouter = require('./router/api-routers');
const staticServer = require('koa-static-server');
const logger = require('koa-logger');
const path = require('path');
onerror(app);
// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(async (ctx, next) => {
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
KoaRouter.use('/api', apiRouter.routes());
app.use(KoaRouter.routes()); // 将api路由规则挂载到Koa上。
// 读取编译后的静态文件
app.use(staticServer({
    rootDir: path.resolve('dist'),
    rootPath: '/'
}));
// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});
exports.default = app;

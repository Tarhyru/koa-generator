"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 路由设置
const KoaRouter = require('koa-router')();
const hello_1 = require("../api/hello");
KoaRouter.get('/hello', hello_1.default.contrl); //getNhData接受post调用
module.exports = KoaRouter;

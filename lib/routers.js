// 路由设置
var KoaRouter = require('koa-router')();
var controller = require('./util/controllerHelp.js');

KoaRouter.get('/hello',controller.hello.sayHello) 


module.exports = KoaRouter;
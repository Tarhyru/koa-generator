"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa_server_1 = require("./koa-server");
const http = require("http");
const koa_config_js_1 = require("../config/koa-config.js");
const debug = require('debug')('demo:server');
// 打印输出端口号
console.log('listen prot: ' + koa_config_js_1.port);
const server = http.createServer(koa_server_1.default.callback());
exports.server = server;
server.listen(koa_config_js_1.port);
server.on('error', onError);
server.on('listening', onListening);
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof koa_config_js_1.port === 'string'
        ? 'Pipe ' + koa_config_js_1.port
        : 'Port ' + koa_config_js_1.port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
exports.default = server;

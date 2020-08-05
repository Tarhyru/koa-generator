/**
 *  http 响应时的容器
 *  @param{number} retCode
 *  1000 默认返回值
 *  2000 成功
 */
export class resultContext {
    code: number;
    contents: any;
    text: string;
    constructor({ code = 100, text = "连接成功" }) {
        this.code = code;

        this.contents = {};

        this.text = text;
    }
}

/**
 *  数据库操作 响应时的容器
 *  @param{string} retState
 *  0 默认值
 *  1 请求成功
 * -1 请求失败
 *  @param{any} result
 *  通常为执行结果
 *  @param{any} errMsg
 *  失败时为 错误信息
 */
export class queryContext {
    retState: number;
    result: any;
    errMsg: any;
    constructor() {
        this.retState = 0;
        this.result = [];
        this.errMsg = null;
    }
}

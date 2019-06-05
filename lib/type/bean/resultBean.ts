/**
 *  http 响应时的容器
 *  @param{number} retCode 
 *  100 默认返回值
 *  200 成功
 */
export class resultBean{
    code:number
    contents:any
    text:string
    constructor({
        code = 100 ,
        text = '连接成功'
    }={}){
        this.code= code;
        
        this.contents = {};
        
        this.text = text;
    }
}

/**
 *  数据库操作 响应时的容器
 *  @param{string} retState 
 *  0 默认值
 *  1 请求成功
 *  -1 链接失败
 *  -2 查询失败
 *  @param{any} result
 *  通常为执行结果
 *  @param{any} errMsg 
 *  失败时为 错误信息
 */
export class queryBean{
    retState:number
    result:any
    errMsg:any
    constructor({
        retState = 0,
        result = null,
        errMsg = null
    }={}){
        this.retState= retState;
        this.result = result;
        this.errMsg = errMsg;
    }
}

const fs = require('fs');
const path = require('path');
let { parse: pathParse, join: pathJoin } = path;





/**
 * 递归遍历指定文件夹下指定类型的文件 入口
 * @param opt           参数
 * @param opt.dir       目录
 * @param opt.fileType  需要的文件类型(可选) 不传则取所有的文件
 */
async function fsRecursive(opt = {
    dir: '',
    fileType: []
}) {
    let result = [];
    let { dir, fileType } = opt;
    let directoryResult = [dir];
    let typeMap = 'all';
    if (fileType) {
        typeMap = {};
        fileType.forEach((exName, i) => {
            typeMap[exName] = true
        });
    }

    await makeTask(directoryResult, typeMap).then((res) => {
        result = result.concat(res);
    }).catch(err => {
        console.log(`fsRecursive :某个task失败！${err}`)
    });

    return result
}
function makeTask(directoryResult, typeMap) {
    let result = [];
    let taskPromise = new Promise((resolve, reject) => {
        task(directoryResult, typeMap);

        function task(directoryResult, typeMap) {
            let promiseArr = [];
            let newFindDir = [];
            for (let dir of directoryResult) {
                promiseArr.push(recurisveStep(dir, typeMap));
            }
            Promise.all(promiseArr).then((values) => {
                for (let stepReulst of values) {
                    newFindDir = newFindDir.concat(stepReulst.directoryResult);
                    result = result.concat(stepReulst.result);
                }
                if (newFindDir.length === 0) {
                    resolve(result)
                } else {
                    task(newFindDir, typeMap);
                }
            });
        }
    })
    return taskPromise
}
function recurisveStep(dir, typeMap) {
    let promise = new Promise((resolve, reject) => {
        let rootList = [];
        try {
            rootList = fs.readdirSync(dir);
        } catch (err) {
            console.log(`recurisveStep :目录读取失败 ${dir}`);
        }

        let result = [];
        let directoryResult = [];

        for (let fileName of rootList) {
            let asbPath = pathJoin(dir, fileName);
            try {
                let fileState = fs.statSync(asbPath);
                if (fileState.isDirectory()) {
                    directoryResult.push(asbPath);
                } else {
                    let fsType = pathParse('./' + fileName);
                    let extName = fsType.ext.slice(1);
                    let item = {
                        fileName,
                        filePath: dir
                    }
                    if (typeMap === 'all' || typeMap[extName]) {
                        result.push(item)
                    }

                }
            } catch (err) {
                console.log('recurisveStep : 文件信息获取失败', asbPath);
            }
        }
        resolve({
            result,
            directoryResult
        });
    });
    return promise
}

function fsRecursiveSync(opt = {
    dir: '',
    fileType: []
}) {
    let { dir, fileType } = opt;
    var result = [];
    var directoryResult = [dir];

    let typeMap = 'all';
    if (fileType) {
        typeMap = {};
        fileType.forEach((exName, i) => {
            typeMap[exName] = true
        });
    }
    while(directoryResult.length!=0){
        var getDirectoryDir = directoryResult.pop();
        if(typeof getDirectoryDir !=='string'){
            throw 'fsRecursiveSync Err';
        }
        step(getDirectoryDir,typeMap);
    }
    function step(dir,typeMap) {
        var rootList = [];
        try {
            rootList = fs.readdirSync(dir);
        } catch (error) {
            console.log('err:', error);
            return false
        }
       
        for (let fileName of rootList) {
            let asbPath = pathJoin(dir, fileName);
            try {
                let fileState = fs.statSync(asbPath);
                if (fileState.isDirectory()) {
                    directoryResult.push(asbPath);
                } else {
                    let fsType = pathParse('./' + fileName);
                    let extName = fsType.ext.slice(1);
                    let item = {
                        fileName,
                        filePath: dir
                    }
                    if (typeMap === 'all' || typeMap[extName]) {
                        result.push(item)
                    }

                }
            } catch (err) {
                console.log('recurisveStep : 文件信息获取失败', asbPath);
            }
        }
    }
    return result
}
module.exports = fsRecursiveSync;
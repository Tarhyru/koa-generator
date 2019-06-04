const fsRecursiveSync = require('./fsRecursive');
const path = require('path');
const controllerDir = path.join(__dirname, '../controller');
const controlList = {

};
var controllList = fsRecursiveSync({
    dir: controllerDir,
    fileType: ['js']
})

controllList.forEach((findItem) => {
    controlList[path.parse(findItem.fileName).name] = require(path.join(findItem.filePath, findItem.fileName));
});

module.exports = controlList;
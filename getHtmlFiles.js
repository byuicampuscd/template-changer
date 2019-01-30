const fs = require('fs'),
    path = require('path'),
    readDirRec = require('recursive-readdir'),
    readDir = require('./readDir.js'),
    readFile = require('./readFile.js');

function readDir(pathIn) {
    return new Promise(function (resolve, reject) {
        fs.readdir(folder, (e, data) => {
            if (e) {
                reject(e);
            } else {
                resolve(data);
            }
        })
    });
}

module.exports = async function (startFolder, recursive) {
    var fileNames, htmlFileNames;
    if (recursive) {
        fileNames = await readDirRec(startFolder);
    } else {
        fileNames = await readDir(startFolder);
    }

    //keep just html files
    htmlFileNames = fileNames.filter(fileName => path.extname(fileName).toLowerCase() === '.html');

    return Promise.all(htmlFileNames.map(async fileName => {
        var fullPath = path.resolve(fileName);
        //get the file contents
        fileContents = await readFile(fileName);


        //make obj to keep track of where we are
        return {
            location: fullPath,
            name: path.parse(fullPath).base,
            contents: fileContents
        }
    }))
}
const fs = require('fs'),
    path = require('path'),
    readDirRec = require('recursive-readdir'),
    readFile = require('./readFile.js'),
    folderPrefix = require('./folderPrefix.js');

function readDir(pathIn) {
    return new Promise(function (resolve, reject) {
        fs.readdir(pathIn, (e, data) => {
            if (e) {
                reject(e);
            } else {
                resolve(data);
            }
        });
    });
}

function ignoreFunc(file, stats) {
    return stats.isDirectory() && path.basename(file).includes(folderPrefix);
}

module.exports = async function (startFolder, recursive) {
    var fileNames, htmlFileNames;
    try {

        if (recursive) {
            fileNames = await readDirRec(startFolder, [ignoreFunc]);
        } else {
            fileNames = await readDir(startFolder);
        }

        //keep just html files
        htmlFileNames = fileNames.filter(fileName => path.extname(fileName).toLowerCase() === '.html');

    } catch (error) {
        console.log(error);
    }

    return Promise.all(htmlFileNames.map(async fileName => {
        try {
            var fullPath = path.resolve(fileName);
            //get the file contents
            var fileContents = await readFile(fileName);


            //make obj to keep track of where we are
            return {
                location: fullPath,
                name: path.parse(fullPath).base,
                contents: fileContents
            };
        } catch (error) {
            console.log(error);
        }
    }));
};
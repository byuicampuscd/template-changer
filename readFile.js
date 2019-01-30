const fs = require('fs'),
    path = require('path');
module.exports = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path.resolve(fileName), 'utf8', (e, file) => {
            if (e) {
                reject(e);
            } else {
                resolve(file);
            }
        });
    });
};
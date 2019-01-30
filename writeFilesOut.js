const writeFile = require('write');

function dirExist(dirPath) {
    //does it exist?
    try {
        //yes it does try again
        fs.statSync(dirPath).isDirectory();
        return true;
    } catch (e) {
        //error nope so does not exist
        return false;
    }
}

function makeMainDir(currentFolder, folderNameIn) {
    var num = 1,
        pathOut = path.join(currentFolder, folderNameIn);
    //this will make sure that 1 does not get appened only greater than 1

    //if the folder already exists
    while (dirExist(pathOut)) {
        num += 1;
        pathOut = path.join(currentFolder, folderNameIn + num);
    }
    //make full path
    pathOut = path.resolve(pathOut);

    //found one, make it and return the name
    fs.mkdirSync(pathOut);

    return pathOut;

}

module.exports = async function (files, templateFileName) {
    //does a folder named the current template exist?
    const currentFolder = process.cwd(),
        dirOut = makeMainDir(currentFolder, templateFileName);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        //build the file path
        // get relative path
        let relativePath = path.relative(currentFolder, file.location);
        pathOut = dirOut,
            textOut = file.processed;

        //if we have any errors then add in the extra folder 
        //and write the unedited file contents out
        if (file.errors.length > 0) {
            path.join(pathOut, "Missing " + file.errors[0].name);
            textOut = file.contents;
        }

        //resolve it to get final path out
        pathOut = path.resolve(pathOut, relativePath);


        console.log('-------------------');
        console.log(file.location);
        console.log(pathOut);

        //write it
        await writeFile.promise(pathOut, textOut, 'utf8');
    }

    return dirOut;

}
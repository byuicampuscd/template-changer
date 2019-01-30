chalk = require('chalk');

function printCounts(counts) {
    var errorText = '';

    Object.keys(counts).forEach(function (countKey) {
        if (countKey !== "workedSuccessfully" && counts[countKey] > 0) {
            errorText += "Variable: " + countKey + ", " + counts[countKey] + " files";
        }
    });

    console.log('');
    console.log(chalk.green('---------------- Files Successfully Processed --------------------'));
    console.log("Successfully Processed:", counts.workedSuccessfully, "files");
    if (errorText !== '') {
        console.log('');
        console.log(chalk.red('---------------- Files Missing Mandatory Variables --------------------'));
        console.log(errorText);

    }
}

function makeCounts(htmlFiles) {

    var counts = {
        workedSuccessfully: 0
    };

    return htmlFiles.reduce(function (counts, file) {
        if (file.errors.length === 0) {
            counts.workedSuccessfully += 1;
        } else {
            counts[file.errors[0].name] += 1;
        }
        return counts;
    }, counts);
}

module.exports = function (htmlFiles, outputDir) {
    //tell them where they ended up!
    console.log("");
    console.log(chalk.green("The processed files are located in the following directory:"));
    console.log(path.relative(process.cwd(), outputDir));
    var counts = makeCounts(htmlFiles); 
    printCounts(counts);
}
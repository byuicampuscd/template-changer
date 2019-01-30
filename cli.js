#!/usr/bin/env node

// go parse the args and make sure that we have what we need
var args = require('./parseArgs.js'),
    getHtmlFiles = require('./getHtmlFiles.js'),
    readFile = require('./readFile'),
    writeFilesOut = require('./writeFilesOut.js'),
    runTemplate = require('./runTemplate.js'),
    parseVarsFile = require('./parseVarsFile.js'),
    parseTemplateFile = require('./parseTemplateFile.js'),
    printReport = require('./printReport.js');


async function printFile(filename) {
    var path = require('path');
    console.log(await readFile(path.join(__dirname, filename)));
}

async function runTheTemplates(args) {
    var varsFile, parsedVarsFile, templateFile, parsedTemplateFile, htmlFiles, folderOut,
        startFolder = process.cwd();
    try {

        //add the fileNames in
        args.varsFileName = args._[0];
        args.templateFileName = args._[1];

        //get the vars file
        varsFile = await readFile(args.varsFileName);
        parsedVarsFile = parseVarsFile(varsFile);

        //get the template file
        templateFile = await readFile(args.templateFileName);
        parsedTemplateFile = parseTemplateFile(templateFile, args.templateFileName);

        //get the html files
        htmlFiles = await getHtmlFiles(startFolder, args.recursive === true);

        // process each the html   
        htmlFiles.forEach(htmlFile => runTemplate(htmlFile, parsedVarsFile, parsedTemplateFile));

        // write out all the files to the correct location
        folderOut = await writeFilesOut(htmlFiles, args.templateFileName);

        // print report
        printReport(htmlFiles, folderOut);
    } catch (error) {
        console.log(error);
    }
}

/****************************/
/********** START ***********/
/****************************/
try {

    if (args.template) {
        printFile('templateExample.handlebars');
    } else if (args.variables) {
        printFile('variablesExample.txt');
    } else {

        runTheTemplates(args);
    }
} catch (error) {
    console.log(error);
}
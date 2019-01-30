/*jslint plusplus: true, node: true, devel: true */
"use strict";

var htmlParse = require('cheerio'),
    prettyHtml = require('js-beautify').html,
    errorHandler = require('./errorHandler.js'),
    parseVarsFile = require('./parseVarsFile.js'),
    parseTemplateFile= require('./parseTemplateFile.js');

function doesExist(thingIn) {
    return typeof thingIn !== 'undefined' && thingIn !== null && thingIn !== '';
}

function checkFileVars(context, varsArray) {
    var errors = [];
    //make sure it passes doesExist and if it is a bool that it is true
    varsArray.forEach(function (varIn) {
        if (varIn.isMandatory && (!doesExist(context[varIn.name]) || context[varIn.name] === false)) {
            errors.push({
                name: varIn.name,
                missing: true
            });
        }
    });
    return errors;
}

function makeFileVars(fileObj, varsArray) {
    var contextOut = {},
        $ = htmlParse.load(fileObj.contents);

    function getHtml(ele) {
        return ele.html();
    }

    function getBool(ele) {
        return doesExist(getHtml(ele));
    }

    function getText(ele) {
        if (ele.toArray) {
            ele = ele.toArray()[0];
        }

        return $(ele).text();
    }

    function getOuterHtml(ele) {
        if (ele.toArray) {
            ele = ele.toArray()[0];
        }
        return $.html(ele);
    }

    function getAttr(ele, attr) {
        return ele.attr(attr);
    }

    function getArray(eleIn, funIn, attr) {
        return eleIn.toArray().map(function (ele) {
            return funIn($(ele), attr);
        });
    }

    varsArray.forEach(function (varIn) {
        var selected = $(varIn.selector),
            funUsed;

        //what function are we going to use?
        if (varIn.command.toLowerCase() === 'html') {
            funUsed = getHtml;
        } else if (varIn.command.toLowerCase() === 'bool') {
            funUsed = getBool;
        } else if (varIn.command.toLowerCase() === 'text') {
            funUsed = getText;
        } else if (varIn.command.toLowerCase() === 'outerhtml') {
            funUsed = getOuterHtml;
        } else {
            funUsed = getAttr;
        }

        //do we want an array or not?
        if (varIn.makeArray) {
            contextOut[varIn.name] = getArray(selected, funUsed, varIn.command);
        } else {
            contextOut[varIn.name] = funUsed(selected, varIn.command);
        }
    });

    //add the default helper vars
    contextOut.fileName = fileObj.name;
    contextOut.fileContents = fileObj.contents;
    return contextOut;
}

module.exports = function runTemplate(fileObj, varsArray, hbTemplate) {
    //do we need to parse some stuff? this allows the user to send strings that we parse or they can parse them them selfs and then pass in
    if(typeof hbTemplate === "string"){
        hbTemplate = parseTemplateFile(hbTemplate);
    }

    if(typeof varsArray === "string"){
        varsArray =  parseVarsFile(varsArray);
    }

    //pull vars from html file
    var context = makeFileVars(fileObj, varsArray),
        errors = checkFileVars(context, varsArray);

    if (errors.length === 0) {
        //run template
        fileObj.processed = prettyHtml(hbTemplate(context));
    } else {
        fileObj.processed = '';
    }
    //will be empty if no errors
    fileObj.errors = errors;
};

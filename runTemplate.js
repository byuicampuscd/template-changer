/*jslint plusplus: true, node: true, devel: true */
"use strict";

var htmlParse = require('cheerio'),
    prettyHtml = require('js-beautify').html,
    errorHandler = require('./errorHandler.js');

function doesExist(thingIn) {
    return typeof thingIn !== 'undefined' && thingIn !== null && thingIn !== '';
}

function checkFileVars(context, varsArray) {
    var errors = [];
    varsArray.forEach(function (varIn) {
        if ((varIn.isMandatory && !doesExist(context[varIn.name])) || context[varIn.name] === false) {
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

    function getAttr(ele, attr) {
        return ele.attr(attr);
    }

    function getArray(eleIn, funIn, attr) {
        var arrOut = [];
        eleIn.each(function (i, ele) {
            arrOut.push(funIn($(ele), attr));
        });

        return arrOut;
    }

    varsArray.forEach(function (varIn) {
        var selected = $(varIn.selector),
            funUsed;

        //what function are we going to use?
        if (varIn.command === 'html') {
            funUsed = getHtml;
        } else if (varIn.command === 'bool') {
            funUsed = getBool;
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
    //get vars from file
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

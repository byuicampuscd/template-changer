/*jslint plusplus: true, node: true, devel: true */
"use strict";

var htmlParse = require('cheerio'),
   prettyHtml = require('js-beautify').html,
   enums = require('./enums.js');

function processTemplate(name, text, options, templates) {

   var $ = htmlParse.load(text),
      objOut = {
         name: name,
         textIn: text,
         textOut: "",
         templateUsed: ""
      },
      hasMatchInFile;

   function run(template) {
      objOut.textOut = prettyHtml(template.top + '\n' + $(options.selector).html() + '\n' + template.bottom);
      objOut.templateUsed = template.name;
   }

   //if its just normal
   if (options.mode === enums.mode.NORMAL) {
      run(templates[0]);
      return objOut;
   }

   //if we need to check first
   if (options.mode === enums.mode.IF || options.mode === enums.mode.IF_ELSE) {
      //check if we have a match in the current file
      hasMatchInFile = $(options.selectorIf).length > 0;

      //run template in IF or IF_ELSE if have match
      if (hasMatchInFile) {
         run(templates[0]);
      }

      //if no match but in IF_ELSE
      if (!hasMatchInFile && options.mode === enums.mode.IF_ELSE) {
         run(templates[1]);
      }
      return objOut;
   }

   //if type doesn't match
   throw "Invalid mode type";
}

module.exports = function (textInList, options, templates) {
   return textInList.map(function (text) {
      return processTemplate(text.name, text.textIn, options, templates);
   });
};
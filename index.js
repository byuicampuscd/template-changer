#!/usr/bin/env node

/*jslint node:true, nomen: true */
(function () {
   "use strict";

   var fs = require('fs'),
      path = require('path'),
      processTemplate = require('./processTemplates.js'),
      errorHandler = require('./errorHandler.js'),
      enums = require('./enums.js'),
      folder = process.cwd(),
      templates = [],
      options,
      htmlFileNames;

   function parseTheArgs(argsIn) {
      var args = argsIn.slice(2),
         parsed = {
            err: ''
         },
         hasACorrectLength = args.length === 2 || args.length === 5 || args.length === 7;

      //check for correct lenghts
      if (!hasACorrectLength) {
         parsed.err = 'The parameters are missing or are not in the correct format.';
         return parsed;
      }

      //this is always a selector
      parsed.selector = args[0];

      //get the rest
      if (args.length === 2) {
         parsed.templateFileName = args[1];
         parsed.mode = enums.mode.NORMAL;
      } else if (args.length === 5) {
         if (args[1].toUpperCase() === 'IF' && args[3].toUpperCase() === 'THEN') {
            parsed.selectorIf = args[2];
            parsed.templateFileName = args[4];
            parsed.mode = enums.mode.IF;
         } else {
            parsed.err = 'There are 5 parameters but they are not in the correct format.';
         }
      } else if (args.length === 7) {
         if (args[1].toUpperCase() === 'IF' && args[3].toUpperCase() === 'THEN' && args[5].toUpperCase() === 'ELSE') {
            parsed.selectorIf = args[2];
            parsed.templateFileName = args[4];
            parsed.templateFileNameElse = args[6];
            parsed.mode = enums.mode.IF_ELSE;
         } else {
            parsed.err = 'There are 7 paramitiers but they are not in the correct format.';
         }
      }

      return parsed;
   }

   function getTemplate(filename) {
      var guts = fs.readFileSync(filename, 'utf8'),
         split = guts.split(/^\s*\|+\s*$/m),
         objOut = {
            name: path.basename(filename, '.txt'),
            top: '',
            bottom: ''
         };

      //do we have something
      if (split.length > 0) {
         objOut.top = split[0];
         objOut.bottom = split[1];
      }

      return objOut;
   }

   function getHtmlFileNames(folder) {
      var htmlFileNames = fs.readdirSync(folder);
      //filter down to just html
      htmlFileNames = htmlFileNames.filter(function (file) {
         return path.extname(file) === '.html';
      });
      return htmlFileNames;
   }
   /********************************************
    ****************** start ****************
    *********************************************/

   //new line
   console.log('');

   //parse the Aargs
   options = parseTheArgs(process.argv);

   //if error give some help and return
   if (options.err !== '') {
      //console.log("options:", options);
      errorHandler.handle(options.err);
      return;
   }

   //Get the templates
   try {
      templates.push(getTemplate(options.templateFileName));
      if (options.mode === enums.mode.IF_ELSE) {
         templates.push(getTemplate(options.templateFileNameElse));
      }
   } catch (e1) {
      errorHandler.handle('An error occured wile reading a template file.', e1.message);
      //console.log("templates:", templates);
      return;
   }

   //get all the html file names
   try {
      htmlFileNames = getHtmlFileNames(folder);
   } catch (e2) {
      errorHandler.handle('An error occured wile looking for html files to edit in the current folder.', e2.message);
      return;
   }

   //This will read the files, change the template, make the folders and write out the eddited files 
   processTemplate(htmlFileNames, options, templates);
}());

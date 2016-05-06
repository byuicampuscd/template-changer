/*jslint plusplus: true, node: true, devel: true */
"use strict";

var fs = require('fs'),
   path = require('path'),
   errorHandler = require('./errorHandler.js'),
   folder = process.cwd();

function readFiles(file, callback) {
   fs.readFile(file, 'utf8', function (error, guts) {
      if (error) {
         callback(error);
      }
      //remember the file name
      callback(null, {
         name: file,
         textIn: guts
      });
   });
}

function writeFiles(file, callback) {
   if (file.templateUsed !== '') {
      fs.writeFile(path.join(folder, file.templateUsed, file.name), file.textOut, 'utf8', function (err) {
         if (err) {
            callback(err);
         }

         callback(null);
      });
   } else {
      callback(null);
   }
}

function makeCounts(processed, templates) {
   function countThem(templateName) {
      var count = 0;
      processed.forEach(function (file) {
         if (templateName === file.templateUsed) {
            count += 1;
         }
      });
      return count;
   }

   return templates.map(function (template) {
      return {
         name: template.name,
         count: countThem(template.name)
      };
   });
}

function makeDirs(templates) {
   function makeDir(folderName, numIn) {
      var folderNameOut = path.join(folder, folderName);
      //does it exsit?
      try {
         fs.statSync(folderNameOut).isDirectory();
      } catch (e) {
         //error nope so make it
         fs.mkdir(folderNameOut);
      }
   }

   templates.forEach(function (template) {
      makeDir(template.name);
   });

}

function printCounts(counts, numberOfFiles) {
   var totalProcessed = 0;
   console.log('Template Use Counts:');
   console.log('------------------------------------');
   counts.forEach(function (count) {
      totalProcessed += count.count;
      console.log(count.name + ":", count.count, "files");
   });
   console.log("Unprocessed HTML files:", numberOfFiles - totalProcessed, "files");

   console.log('\nTotal html files in current folder:', numberOfFiles, "files");
}

//do the magic! do the magic!
module.exports = function (htmlFileNames, options, templates) {
   var async = require('async');
   async.map(htmlFileNames, readFiles, function (err, results) {

      var changeTemplate = require('./changeTemplate.js'),
         processed = changeTemplate(results, options, templates),
         counts = makeCounts(processed, templates);

      //make Dirs
      makeDirs(templates);

      //write files
      async.each(processed, writeFiles, function (err, results) {
         if (err) {
            errorHandler.handle('Problem while writing edited html files.', err.message);
         }

         printCounts(counts, processed.length);
      });
   });
};
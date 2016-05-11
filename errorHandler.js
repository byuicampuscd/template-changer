/*jslint plusplus: true, node: true, devel: true */
"use strict";

module.exports = {
   printHelp: function () {

      console.log('\n\n---------------------------------- HELP ---------------------------------------');
      console.log('You can run this program three different ways.');
      console.log('    1. Normal');
      console.log('        Ex: templateChanger selectorKeep template1.txt');
      console.log('        This will change the template on every html file in the current folder.\n');

      console.log('    2. With an IF and THEN');
      console.log('        Ex: templateChanger selectorKeep IF selectorIf THEN template1.txt');
      console.log('        This will only change the template on html files in the current folder that have an element that matches selectorIf.\n');

      console.log('    3. With an IF, THEN and an ELSE');
      console.log('        Ex: templateChanger selectorKeep IF selectorIf THEN template1.txt ELSE template2.txt');
      console.log('        This will change the template on every html file in the current folder conditionally.');
      console.log('        If the html file has an element that matches selectorIf then it will use template1.txt otherwise it will use template2.txt.\n');

      console.log('\nThe edited html files will be placed in a folder named after the template that was used to transform it.');
      console.log('\nRemember to put double quotes around your selectors if they have spaces in them.');
      console.log('    Ex: templateChanger "div ~ p strong" template.txt');
      console.log('-------------------------------------------------------------------------------');
   },
   handle: function (message, systemError) {
      var messageOut = "ERROR: " + message;

      if (typeof systemError !== 'undefined') {
         messageOut += 'See system error message below for more information. \nSYSTEM ERROR MESSAGE: \n    ' + systemError;
      }

      console.log(messageOut);
      this.printHelp();
   }
};
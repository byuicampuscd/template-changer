const readFile = require('./readFile.js'),
    Handlebars = require('handlebars');

module.exports = async function makeTemplateFunction(templateFileName) {
    var templateText = await readFile(templateFileName).trim();

    if (templateText.length === 0) {
        throw new Error('The template file "' + templateFileName + '" is empty.');
    }

    return Handlebars.compile(templateText);
}
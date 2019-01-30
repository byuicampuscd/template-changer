const Handlebars = require('handlebars');

module.exports = function makeTemplateFunction(templateText, templateFileName) {

    templateText = templateText.trim();
    if (templateText.length === 0) {
        throw new Error('The template file "' + templateFileName + '" is empty.');
    }

    return Handlebars.compile(templateText);
};
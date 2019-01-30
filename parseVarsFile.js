function makeVarsObject(variablesFile) {
    function ordinalNumber(numIn) {
        var textOut = numIn,
            endings = ['th', 'st', 'nd', 'rd'],
            onesPlace = numIn % 10;

        if (typeof numIn !== 'number' || isNaN(numIn)) {
            throw 'Need a number to make an ordinal number. Number given: ' + numIn;
        }
        if (onesPlace > 3) {
            textOut += endings[0];
        } else {
            textOut += endings[onesPlace];
        }
        return textOut;
    }

    var vars;
    variablesFile = variablesFile.trim();

    if (variablesFile.length === 0) {
        throw new Error('Variables text file is empty.');
    }

    //make an array
    vars = variablesFile.split('\n');

    //process each line
    vars = vars.map(function (line, lineIndex) {
        var isMandatory,
            split;

        line = line.trim();

        isMandatory = line.charAt(0) === '*';

        if (isMandatory) {
            //drop the *
            line = line.substr(1);
        }

        split = line.split('|');

        if (split.length < 3 || split.length > 4) {
            throw new Error('The ' + ordinalNumber(lineIndex + 1) + ' variable in the variable file does not have 2 or 3 "|" in it.');
        }

        return {
            name: split[0].trim(),
            selector: split[1].trim(),
            command: split[2].trim(),
            makeArray: (typeof split[3] !== 'undefined' || split[3] === '') && split[3].trim() === 'array',
            isMandatory: isMandatory
        };
    });

    return vars;
}

module.exports = makeVarsObject;
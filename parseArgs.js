var yargs = require('yargs');

module.exports = yargs
    .usage('\nUsage: template-changer [options] variablesFilePath handlebarsTemplatePath')
    .options({
        't': {
            alias: 'template',
            describe: 'Print example template file.',
            boolean: true
        },
        'v': {
            alias: 'variables',
            describe: 'Print default variables file',
            boolean: true
        },
        'r': {
            alias: 'recursive',
            describe: 'Recursively find html files in directories. Keeps directory structure on save.',
            boolean: true
        }
    })
    .help()
    // user can use -h or --help
    .alias('h', 'help')
    //makes sure we have what we want
    .check(function (args, options) {
        // only work if they have two strings or have given t or given v and not both v and t
        if (args.t === true && args.v === true) {
            throw new Error('Can not provide both -t and -v at the same time');
        } else if (args._.length !== 2 && (args.t === undefined && args.v === undefined)) {
            throw new Error('Must only give path to variable and template file or give -t or -v');
        }

        return true;
    })
    .argv;
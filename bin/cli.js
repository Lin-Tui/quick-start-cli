#! /usr/bin/env node

const program = require('commander');
program.version(`v${require('../package.json').version}`).usage('<command>[option]');

program
    .command('create <app-name>')
    .description('create a new project')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        require('../lib/create.js')(name, options);
    });
program.parse(process.argv);
console.log('ppx working~');

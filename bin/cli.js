#! /usr/bin/env node

const program = require('commander'); // 命令行工具
const chalk = require('chalk'); // 命令行输出美化
const figlet = require('figlet'); //
const didYouMean = require('didyoumean'); // 简易的智能匹配引擎
const enhanceErrorMessage = require('../lib/utils/enhanceErrorMessage.js');

program.version(`v${require('../package.json').version}`).usage('<command>[option]');

program.on('--help', () => {
    console.log(
        '\r\n' +
            figlet.textSync('ppx', {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 80,
                whitespaceBreak: true
            })
    );
    console.log(
        `\r\nRun ${chalk.cyan('ppx <command> --help')} for detail usage of given command\r\n`
    );
});

program
    .command('create <app-name>')
    .description('create a new project')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        require('../lib/create.js')(name, options);
    });

// 处理非法命令
program.argument('<command>').action(cmd => {
    // 不退出输出帮助信息
    program.outputHelp();
    console.log(chalk.red('Unknown command:') + chalk.yellow(cmd));
    suggestCommands(cmd);
});

enhanceErrorMessage('missingArgument', argsName => {
    return `Missing required argument ${chalk.yellow(`<${argsName}>`)}`;
});

program.parse(process.argv);

function suggestCommands(cmd) {
    const avaliableCommands = program.commands.map(cmd => {
        return cmd._name;
    });
    const suggestion = didYouMean(cmd, avaliableCommands);
    if (suggestion) {
        console.log(chalk.red('Did you mean:') + chalk.yellow(suggestion));
    }
}

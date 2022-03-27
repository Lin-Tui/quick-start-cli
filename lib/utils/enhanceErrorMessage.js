const { Command } = require('commander');
const chalk = require('chalk');

// 重写commander某些事件
module.exports = (methodName, log) => {
    Command.prototype[methodName] = function (...args) {
        if (methodName === 'unknownOption' && this._allowUnknowOption) {
            return false;
        }
        this.outputHelp();
        console.log(chalk.red(log(...args)));
        console.log();
        process.exit(1);
    };
};

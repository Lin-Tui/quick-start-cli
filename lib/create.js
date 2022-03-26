const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

module.exports = function (name, options) {
    const cwd = process.cwd();
    const targetPath = path.join(cwd, name);
    console.log('000000000', targetPath);
    console.log('11111111111111', options);
    // if (fs.existsSync(targetPath)) {
    //     if (options.force)
    // }
};

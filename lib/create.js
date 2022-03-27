const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer'); // 一个强大的交互式命令行工具
const symbol = require('log-symbols'); // 控制台彩色日志符号，用来显示√ 或者 × 等图标。
const ejs = require('ejs');
const prettier = require('prettier');
const {
    logWithSpinner,
    pauseSpinner,
    stopSpinner,
    resumeSpinner
} = require('../lib/utils/spinner');

const handleDirExist = async (targetPath, isForce) => {
    if (isForce) {
        fs.removeSync(targetPath);
    } else {
        await inquirer
            .prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: 'Target directory already exists. Pick an action:',
                    choices: [
                        {
                            name: 'Overwrite',
                            value: 'overwrite'
                        },
                        {
                            name: 'Cancel',
                            value: false
                        }
                    ]
                }
            ])
            .then(answer => {
                const { action } = answer;
                if (!action) {
                    return;
                } else if (action === 'overwrite') {
                    try {
                        stopSpinner();
                        logWithSpinner(`⠋`, `Removing. This might take a while...`);
                        fs.removeSync(targetPath);
                        stopSpinner();
                        console.log(symbol.success, chalk.cyan('Successfully removed.\n'));
                    } catch (err) {
                        stopSpinner();
                        console.log(chalk.red(err));
                    }
                }
            });
    }
};

const createProject = async (features, targetPath, projectName) => {
    try {
        const optionsFileMap = {
            Eslint: ['.eslintrc.js', '.eslintignore'],
            Prettier: ['.prettierrc.js', '.prettierignore'],
            Jest: ['jest.config.js'],
            GitHook: ['.commitlintrc.js']
        };
        stopSpinner();
        logWithSpinner(`⠋`, `Create project. This might take a while...`);
        const templatesPath = path.join(__dirname, '../', 'templates');
        fs.copySync(path.join(templatesPath, './requiredFiles'), targetPath);
        const ProjectInfo = {
            projectName,
            useLint: features.includes('Eslint'),
            usePrettier: features.includes('Prettier'),
            useJest: features.includes('Jest'),
            useGitHook: features.includes('Husky + Lint-staged')
        };
        ProjectInfo.useLint &&
            optionsFileMap.Eslint.forEach(item => {
                fs.copySync(
                    path.join(templatesPath, `./optionalFiles/${item}`),
                    `${targetPath}/${item}`
                );
            });
        ProjectInfo.usePrettier &&
            optionsFileMap.Prettier.forEach(async item => {
                fs.copySync(
                    path.join(templatesPath, `./optionalFiles/${item}`),
                    `${targetPath}/${item}`
                );
            });
        ProjectInfo.useJest &&
            optionsFileMap.Jest.forEach(async item => {
                fs.copySync(
                    path.join(templatesPath, `./optionalFiles/${item}`),
                    `${targetPath}/${item}`
                );
            });
        ProjectInfo.useGitHook &&
            optionsFileMap.GitHook.forEach(async item => {
                fs.copySync(
                    path.join(templatesPath, `./optionalFiles/${item}`),
                    `${targetPath}/${item}`
                );
            });
        await ejs
            .renderFile(path.join(templatesPath, './optionalFiles/package.ejs'), ProjectInfo)
            .then(data => {
                fs.writeFileSync(
                    `${targetPath}/package.json`,
                    prettier.format(data, { parser: 'json' })
                );
            })
            .then(() => {
                stopSpinner();
                logWithSpinner(chalk.green('✔'), chalk.cyan('Successfully created\n'));
            })
            .then(() => {
                stopSpinner();
                console.log();
            });
    } catch (err) {
        stopSpinner();
        console.log(chalk.red(err));
    }
};
module.exports = async function (name, options) {
    try {
        const cwd = process.cwd();
        const targetPath = path.join(cwd, name);
        fs.existsSync(targetPath) && (await handleDirExist(targetPath, options.force));
        await inquirer
            .prompt([
                {
                    name: 'features',
                    type: 'checkbox',
                    message: 'Check the feature needed for your project:',
                    choices: ['Eslint', 'Prettier', 'Jest', 'Husky + Lint-staged']
                }
            ])
            .then(anwser => {
                createProject(anwser.features, targetPath, name);
            });
    } catch (err) {
        console.log(chalk.red(err));
        process.exit(1);
    }
};

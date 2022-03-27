const ora = require('ora'); // 终端加载效果,美化终端交互
const spinner = ora();

let lastMsg = null;

exports.logWithSpinner = (symbol, msg) => {
    if (!msg) {
        msg = symbol;
        symbol = chalk.green('✔');
    }
    if (lastMsg) {
        // 清楚上次的spinner
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        });
    }
    spinner.text = '' + msg;
    lastMsg = {
        symbol: symbol + ' ',
        text: msg
    };
    spinner.start();
};

exports.stopSpinner = persist => {
    if (lastMsg && persist !== false) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        });
    } else {
        spinner.stop();
    }
    lastMsg = null;
};

exports.resumeSpinner = function () {
    spinner.start();
};

exports.pauseSpinner = function () {
    spinner.stop();
};

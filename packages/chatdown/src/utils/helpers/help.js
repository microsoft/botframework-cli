/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */

const chalk = require('chalk');

module.exports = function (output) {
    if (!output)
        output = process.stderr;
    output.write('\nChatdown cli tool used to parse chat dialogs (.chat file) into a mock transcript file\n\n© 2018 Microsoft Corporation\n\n');
    output.write(chalk.cyan.bold(`chatdown [chat] [--help] [--version] [--static]\n\n`));
    output.write('\n');
};

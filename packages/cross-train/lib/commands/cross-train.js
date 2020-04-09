"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const bf_cli_command_1 = require("@microsoft/bf-cli-command");
const crossTrain = require('@microsoft/bf-lu/lib/parser/cross-train/cross-train');
const exception = require('@microsoft/bf-lu/lib/parser/utils/exception');
const path = require('path');
const helper = require('./../utils/helper');
class CrossTrain extends bf_cli_command_1.Command {
    async run() {
        try {
            const { flags } = this.parse(CrossTrain);
            if (!path.isAbsolute(flags.in))
                flags.in = path.resolve(flags.in);
            if (flags.config && flags.config !== '') {
                if (!path.isAbsolute(flags.config))
                    flags.config = path.join(flags.in, flags.config);
            }
            else if (flags.rootDialog && flags.rootDialog !== '') {
                if (!path.isAbsolute(flags.rootDialog))
                    flags.rootDialog = path.join(flags.in, flags.rootDialog);
                flags.config = await helper.generateConfig(flags.in, flags.rootDialog);
            }
            const trainedResult = await crossTrain.train(flags.in, flags.intentName, flags.config);
            if (flags.out === undefined) {
                flags.out = path.join(process.cwd(), 'cross-trained');
            }
            await crossTrain.writeFiles(trainedResult.luResult, flags.out);
            await crossTrain.writeFiles(trainedResult.qnaResult, flags.out);
        }
        catch (err) {
            if (err instanceof exception) {
                throw new bf_cli_command_1.CLIError(err.text);
            }
            throw err;
        }
    }
}
exports.default = CrossTrain;
CrossTrain.description = 'Lu and Qna cross train tool';
CrossTrain.flags = {
    help: bf_cli_command_1.flags.help({ char: 'h', description: 'luis:cross-train help' }),
    in: bf_cli_command_1.flags.string({ char: 'i', description: 'source lu and qna files folder' }),
    out: bf_cli_command_1.flags.string({ char: 'o', description: 'output folder name. If not specified, the cross trained files will be wrote to cross-trained folder under folder of current command' }),
    config: bf_cli_command_1.flags.string({ description: 'path to config file of mapping rules which is relative to folder specified by --in. If not specified, it will read default config.json from the folder specified by --in' }),
    intentName: bf_cli_command_1.flags.string({ description: 'Interruption intent name', default: '_Interruption' }),
    rootDialog: bf_cli_command_1.flags.string({ description: 'rootDialog file path which is relative to folder specified by --in. If --config not specified, cross-trian will automatically construct the config from file system based on root dialog file' })
};

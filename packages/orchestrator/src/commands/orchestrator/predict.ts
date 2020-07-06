/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

// import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
import {Command, flags} from '@microsoft/bf-cli-command';
import {Utility} from '@microsoft/bf-orchestrator';

export default class OrchestratorPredict extends Command {
  static description: string = 'Returns score of given utterance using previously created orchestrator examples';

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'The path to source label files from where orchestrator example file will be created from. Default to current working directory.'}),
    out: flags.string({char: 'o', description: 'Path where generated orchestrator example file will be placed. Default to current working directory.'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator model.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorPredict);

    const input: string = flags.in;
    const output: string = flags.out;
    const debug: boolean = flags.debug;
    let nlrPath: string = flags.model;
    if (nlrPath) {
      nlrPath = path.resolve(nlrPath);
    }

    let args: string = `predict --in ${input} --out ${output}`;
    if (flags.debug) {
      args += ' --debug';
    }
    if (nlrPath) {
      args += ` --model ${nlrPath}`;
    }

    if (debug) {
      const loggingMessage: string = `predict.ts: arguments = ${args}`;
      const loggingMessageCodified: string = Utility.debuggingLog(loggingMessage);
      this.log(loggingMessageCodified);
    }

    try {
      const command: string = 'dotnet "' + path.join(...[__dirname, 'netcoreapp3.1', 'OrchestratorCli.dll']) + '" ' + args;
      if (debug) {
        const loggingMessage: string = `predict.ts: command = ${command}`;
        const loggingMessageCodified: string = Utility.debuggingLog(loggingMessage);
        this.log(loggingMessageCodified);
      }
      require('child_process').execSync(command, {stdio: [0, 1, 2]});
    } catch (error) {
      return 1;
    }
    return 0;
  }
}

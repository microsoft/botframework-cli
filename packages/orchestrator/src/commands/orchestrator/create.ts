/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Utility} from '@microsoft/bf-orchestrator';
import {OrchestratorHelper} from '../../utils';

export default class OrchestratorCreate extends Command {
  static description: string = 'Create orchestrator example file from .lu/.qna files, which represent bot modules';

  static examples: Array<string> = [`
    $ bf orchestrator:create 
    $ bf orchestrator:create --in ./path/to/file/
    $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/
    $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'The path to source label files from where orchestrator example file will be created from. Default to current working directory.'}),
    out: flags.string({char: 'o', description: 'Path where generated orchestrator example file will be placed. Default to current working directory.'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator model.'}),
    hierarchical: flags.boolean({description: 'Add hierarchical labels based on lu/qna file name.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h', description: 'Orchestrator create command help'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorCreate);

    const input: string = path.resolve(flags.in || __dirname);
    const output: string = path.resolve(flags.out || __dirname);
    let nlrPath: string = flags.model;
    if (nlrPath) {
      nlrPath = path.resolve(nlrPath);
    }
    const debug: boolean = flags.debug;

    const tsvFilePath: string = path.join(output, 'create.tsv');
    let tsvContent: string = '';

    OrchestratorHelper.deleteFile(tsvFilePath);
    tsvContent = await OrchestratorHelper.getTsvContent(input, flags.hierarchical);
    if (tsvContent.length === 0) {
      const errorMsg: string = 'Invalid input';
      this.log(errorMsg);
      throw new CLIError(errorMsg);
    }

    OrchestratorHelper.writeToFile(tsvFilePath, tsvContent);

    let args: string = `create --in ${tsvFilePath} --out ${output}`;
    if (flags.debug) {
      args += ' --debug';
    }
    if (nlrPath) {
      args += ` --model ${nlrPath}`;
    }

    // TO-DO: figure out rush package dependency with regard to oclif folder structure
    // require("dotnet-3.1") statement works only for local package install
    // process.argv= [process.argv[0], process.argv[1], __dirname + '/netcoreapp3.1/OrchestratorCli.dll', ...process.argv.slice(2)]
    // require("dotnet-3.1")
    try {
      const command: string = 'dotnet "' + path.join(...[__dirname, 'netcoreapp3.1', 'OrchestratorCli.dll']) + '" ' + args;
      if (debug) {
        const loggingMessage: string = `create.ts: command = ${command}`;
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

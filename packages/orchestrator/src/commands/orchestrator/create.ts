/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';
import {OrchestratorSettings} from '../../utils/settings';

export default class OrchestratorCreate extends Command {
  static description: string = 'Creates Orchestrator example file from .lu/.qna files, which represent bot modules';

  static examples: Array<string> = [`
    $ bf orchestrator:create 
    $ bf orchestrator:create --in ./path/to/file/
    $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/
    $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model/directory`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'The path to source label files from where orchestrator example file will be created from. Default to current working directory.'}),
    out: flags.string({char: 'o', description: 'Path where generated orchestrator snapshot file will be placed. Default to current working directory.'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator model directory.'}),
    hierarchical: flags.boolean({description: 'Add hierarchical labels based on lu/qna file name.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h', description: 'Orchestrator create command help'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorCreate);

    const input: string = path.resolve(flags.in || __dirname);
    const output: string = flags.out;
    const nlrPath: string = flags.model;

    Utility.toPrintDebuggingLogToConsole = flags.debug;

    try {
      OrchestratorSettings.init(__dirname, nlrPath, output, __dirname);
      await Orchestrator.createAsync(OrchestratorSettings.ModelPath, input, OrchestratorSettings.SnapshotPath, flags.hierarchical);
      OrchestratorSettings.persist();
    } catch (error) {
      throw (new CLIError(error));
    }

    return 0;
  }
}

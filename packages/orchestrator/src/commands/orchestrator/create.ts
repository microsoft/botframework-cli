/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';
import {OrchestratorSettings} from '../../utils/settings';

export default class OrchestratorCreate extends Command {
  static description: string = 'Create orchestrator snapshot (.blu) file from .lu/.qna/.json/.tsv/.dispatch files, which represent bot modules';

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'The path to source label files from where orchestrator example file will be created from. Default to current working directory.'}),
    out: flags.string({char: 'o', description: 'Path where generated Orchestrator snapshot file will be placed. Default to current working directory.'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator base model directory.'}),
    entityModel: flags.string({char: 'e', description: 'Path to Orchestrator entity base model directory.'}),
    hierarchical: flags.boolean({description: 'Add hierarchical labels based on .lu/.qna file name.  Resulting snapshot file will contain.lu/.qna file name as labels instead of the intents defined in the .lu file(s).'}),
    refresh: flags.boolean({description: 'Refetch LUIS app(s)/QnAMaker kb(s) previously added and recreate Orchestrator snapshot.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h', description: 'Orchestrator create command help'}),
  }
  // ---- NOTE ---- advanced parameters removed from command line, but still can be set through environment variables.
  //
  // --fullEmbeddings  Optional flag to create full embeddings instead
  //                   of compact embeddings.

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorCreate);
    const flagsKeys: string[] = Object.keys(flags);
    if (Utility.isEmptyStringArray(flagsKeys)) {
      this._help();
    }

    const cwd: string = process.cwd();
    const input: string = path.resolve(flags.in || cwd);
    const output: string = flags.out;
    const baseModelPath: string = flags.model;
    const entityBaseModelPath: string = flags.entityModel;
    const refresh: boolean = flags.refresh;

    try {
      let fullEmbeddings: boolean = false;
      if (process.env.fullEmbeddings) {
        fullEmbeddings = true;
      }

      Utility.toPrintDebuggingLogToConsole = flags.debug;
      Utility.debuggingLog(`refresh=${refresh}`);

      OrchestratorSettings.init(cwd, baseModelPath, entityBaseModelPath, output, flags.hierarchical);

      if (refresh) {
        OrchestratorCreate.refreshLuisQnAInputs(input);
      }

      const snapshotFilePath: string = await Orchestrator.createAsync(
        OrchestratorSettings.ModelPath,
        input,
        OrchestratorSettings.SnapshotPath,
        OrchestratorSettings.EntityModelPath,
        flags.hierarchical,
        fullEmbeddings);

      OrchestratorSettings.SnapshotPath = snapshotFilePath;
      OrchestratorSettings.persist();
    } catch (error) {
      throw (new CLIError(error));
    }

    return 0;
  }

  private static refreshLuisQnAInputs(inputPath: string) : any {

  }
}

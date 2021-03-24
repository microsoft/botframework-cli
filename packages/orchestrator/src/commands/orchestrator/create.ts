/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {DataSourceHelper, Orchestrator, OrchestratorHelper, OrchestratorDataSourceSettings, OrchestratorSettings, Utility} from '@microsoft/bf-orchestrator';

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
    const cwd: string = process.cwd();

    if (Utility.isEmptyStringArray(flagsKeys) && !OrchestratorSettings.hasBaseModelSettings(cwd)) {
      this._help();
    }

    let input: string = path.resolve(flags.in || cwd);
    let hierarchical: boolean = flags.hierarchical;
    const output: string = flags.out;
    const baseModelPath: string = flags.model;
    const entityBaseModelPath: string = flags.entityModel;
    let refresh: boolean = flags.refresh;

    Utility.resetFlagToPrintDebuggingLogToConsole(flags.debug);

    try {
      OrchestratorSettings.init(cwd, baseModelPath, entityBaseModelPath, output, flags.hierarchical);

      let fullEmbeddings: boolean = false;
      if (process.env.fullEmbeddings) {
        fullEmbeddings = true;
      }

      Utility.debuggingLog(`refresh=${refresh}`);

      if (DataSourceHelper.isDispatchInput(input)) {
        const dispatchJson: any = JSON.parse(OrchestratorHelper.readFile(input));
        DataSourceHelper.convertDispatchInputs(dispatchJson, OrchestratorSettings.DataSources);
        refresh = true;
      }

      const hasDataSources: boolean = OrchestratorSettings.DataSources && OrchestratorSettings.DataSources.inputs.length > 0;
      if (hasDataSources) {
        input = OrchestratorSettings.DataSources.path;
        hierarchical = true;
      }

      if (refresh) {
        await this.refreshLuisQnAInputs(OrchestratorSettings.DataSources);
      }

      const snapshotFilePath: string = await Orchestrator.createAsync(
        OrchestratorSettings.ModelPath,
        input,
        OrchestratorSettings.SnapshotPath,
        OrchestratorSettings.EntityModelPath,
        hierarchical,
        fullEmbeddings);

      OrchestratorSettings.SnapshotPath = snapshotFilePath;
      OrchestratorSettings.persist();
    } catch (error) {
      throw (new CLIError(error));
    }
  }

  private async refreshLuisQnAInputs(dataSources: OrchestratorDataSourceSettings): Promise<void> {
    if (!dataSources) {
      throw new CLIError('No data sources previously defined');
    }
    for (const dataSource of dataSources.inputs) {
      if (dataSource.Type !== 'file') {
        this.log(`Refreshing ${dataSource.Type} data - id ${dataSource.Id}...`);
      }
      // eslint-disable-next-line no-await-in-loop
      await DataSourceHelper.ensureDataSourceAsync(dataSource, OrchestratorSettings.DataSources.path, false);
    }
  }
}

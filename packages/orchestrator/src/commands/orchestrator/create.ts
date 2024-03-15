/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, Flags} from '@microsoft/bf-cli-command';
import {DataSourceHelper, Orchestrator, OrchestratorHelper, OrchestratorSettings, OrchestratorDataSourceSettings, Utility} from '@microsoft/bf-orchestrator';

export default class OrchestratorCreate extends Command {
  static description: string = 'Create orchestrator snapshot (.blu) file from .lu/.qna/.json/.tsv/.dispatch files, which represent bot modules';

  static flags = {
    in: Flags.string({char: 'i', description: 'The path to source label files from where orchestrator example file will be created from. Default to current working directory.'}),
    out: Flags.string({char: 'o', description: 'Path where generated Orchestrator snapshot file will be placed. Default to current working directory.'}),
    model: Flags.string({char: 'm', description: 'Path to Orchestrator base model directory.'}),
    entityModel: Flags.string({char: 'e', description: 'Path to Orchestrator entity base model directory.'}),
    hierarchical: Flags.boolean({description: 'Add hierarchical labels based on .lu/.qna file name.  Resulting snapshot file will contain.lu/.qna file name as labels instead of the intents defined in the .lu file(s).'}),
    refresh: Flags.boolean({description: 'Refetch LUIS app(s)/QnAMaker kb(s) previously added and recreate Orchestrator snapshot.'}),
    debug: Flags.boolean({char: 'd'}),
    help: Flags.help({char: 'h', description: 'Orchestrator create command help'}),
  }
  // ---- NOTE ---- advanced parameters removed from command line, but still can be set through environment variables.
  //
  // --fullEmbeddings  Optional flag to create full embeddings instead
  //                   of compact embeddings.

  async run(): Promise<void> {
    const {flags}: flags.Output = await this.parse(OrchestratorCreate);
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
      const settings: OrchestratorSettings = OrchestratorSettings.getCurrent();
      settings.init(cwd, baseModelPath, entityBaseModelPath, output, flags.hierarchical);

      let fullEmbeddings: boolean = false;
      if (process.env.fullEmbeddings) {
        fullEmbeddings = true;
      }

      Utility.debuggingLog(`refresh=${refresh}`);

      if (DataSourceHelper.isDispatchInput(input)) {
        const dispatchJson: any = JSON.parse(OrchestratorHelper.readFile(input));
        DataSourceHelper.convertDispatchInputs(dispatchJson, settings.DataSources);
        refresh = true;
      }

      const hasDataSources: boolean = settings.DataSources?.inputs?.length > 0 ?? false;
      if (hasDataSources) {
        hierarchical = true;
        input = DataSourceHelper.getInputFolderPath(flags.in, cwd, settings.DataSources);
      }

      if (refresh) {
        await this.refreshLuisQnAInputs(settings.DataSources);
      }

      const snapshotFilePath: string = await Orchestrator.createAsync(
        settings.ModelPath,
        input,
        settings.SnapshotPath,
        settings.EntityModelPath,
        hierarchical,
        fullEmbeddings);

      settings.SnapshotPath = snapshotFilePath;
      settings.persist();
    } catch (error) {
      throw (new CLIError(error as Error));
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
      await DataSourceHelper.ensureDataSourceAsync(dataSource, dataSources.path, false);
    }
  }
}

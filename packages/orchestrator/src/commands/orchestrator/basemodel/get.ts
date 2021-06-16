/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {OrchestratorBaseModel, OrchestratorHelper, OrchestratorSettings, Utility} from '@microsoft/bf-orchestrator';
import * as path from 'path';

export default class OrchestratorBaseModelGet extends Command {
  static description: string = 'Gets Orchestrator base model'

  static flags: flags.Input<any> = {
    out: flags.string({char: 'o', description: 'Optional. Path to where Orchestrator base model will be saved to. Default to current working directory.'}),
    versionId: flags.string({description: 'Optional. Base model version to download -- reference basemodel:list output for options.  If not specified, default model will be downloaded.'}),
    getEntity: flags.boolean({description: 'Optional. Download default entity model at the same time, which will be placed in the entity subfolder of the output path.', default: false}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h', description: 'Orchestrator basemodel:get command help'}),
    verbose: flags.boolean({char: 'v', description: 'Enable verbose logging', default: false}),
  }

  async run(): Promise<void> {
    const {flags}: flags.Output = this.parse(OrchestratorBaseModelGet);
    const cwd: string = process.cwd();
    const output: string = flags.out || path.join(cwd, 'model');
    let basemodelId: any = flags.versionId || '';
    Utility.resetFlagToPrintDebuggingLogToConsole(flags.debug);

    try {
      if (!OrchestratorHelper.exists(output)) {
        OrchestratorHelper.mkDir(output);
      }

      const settings: OrchestratorSettings = OrchestratorSettings.getCurrent();
      settings.init(cwd, output, '', '');
      const models: any[] = [];

      let versions: any;
      if (basemodelId.length === 0 || flags.getEntity) {
        versions = await OrchestratorBaseModel.getVersionsAsync();
        Utility.debuggingLog(`OrchestratorBaseModelGet.run(): versions=${versions}`);
        if (!versions) {
          throw new CLIError('ERROR: failed getting basemodel configuration from https://aka.ms/nlrversions_0.2');
        }
      }

      if (basemodelId.length === 0) {
        basemodelId = await OrchestratorBaseModel.getDefaultModelId(versions);
      }
      models.push({modelFolder: output, versionId: basemodelId});

      if (flags.getEntity) {
        const entityModelPath: string = path.join(output, 'entity');
        if (!OrchestratorHelper.exists(entityModelPath)) {
          OrchestratorHelper.mkDir(entityModelPath);
        }
        const entityVersionId: string = await OrchestratorBaseModel.getDefaultModelId(
          versions,
          'entity',
          OrchestratorBaseModel.getModelLanguageFromVersionId(basemodelId));
        models.push({modelFolder: entityModelPath, versionId: entityVersionId});
      }

      await Promise.all(
        models.map(async (modelInfo: any) => {
          await OrchestratorBaseModel.getAsync(
            modelInfo.modelFolder,
            modelInfo.versionId,
            (message: any) => {
              if (flags.verbose) {
                this.log(message);
              }
            },
            (message: any) => {
              this.log(`Model ${modelInfo.versionId} downloaded to ${modelInfo.modelFolder}`);
              if (flags.debug) {
                Utility.debuggingLog(`Base model ${modelInfo.versionId} downloaded to ${modelInfo.modelFolder} with message ${message}`);
              }
            });
        })
      );

      settings.persist();
    } catch (error) {
      throw (new CLIError(error));
    }
  }
}

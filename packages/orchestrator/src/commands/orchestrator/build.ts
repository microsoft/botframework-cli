/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {LabelResolver, Orchestrator, OrchestratorHelper, OrchestratorSettings, Utility} from '@microsoft/bf-orchestrator';

export default class OrchestratorBuild extends Command {
  static description: string = 'Creates Orchestrator snapshot file and Orchestrator dialog definition file (optional) for each lu file in input folder.'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to lu file or folder with lu files.'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator model.'}),
    entityModel: flags.string({char: 'e', description: 'Path to Orchestrator entity base model directory.'}),
    out: flags.string({char: 'o', description: 'Path where Orchestrator snapshot/dialog file(s) will be placed. Default to current working directory.'}),
    luconfig: flags.string({description: 'Path to luconfig.json.'}),
    dialog: flags.boolean({description: 'Generate multi language or cross train Orchestrator recognizers.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h', description: 'Orchestrator build command help'}),
  }

  async run(): Promise<void> {
    const {flags}: flags.Output = this.parse(OrchestratorBuild);
    const flagsKeys: string[] = Object.keys(flags);
    if (Utility.isEmptyStringArray(flagsKeys)) {
      this._help();
    }

    const input: string = flags.in ? path.resolve(flags.in) : '';
    const cwd: string = process.cwd();
    let output: string = path.resolve(flags.out || cwd);
    const isDialog: boolean = flags.dialog;
    let luConfig: any = null;
    let luConfigPath: string = flags.luconfig;
    const entityBaseModelPath: string = flags.entityModel;

    if (luConfigPath && luConfigPath.length > 0) {
      luConfigPath = path.resolve(luConfigPath);
      luConfig = JSON.parse(OrchestratorHelper.readFile(luConfigPath));
    }

    if (!OrchestratorHelper.isDirectory(output)) {
      output = path.dirname(output);
    }

    const luInputs: any[] = OrchestratorHelper.getLuInputs(input);
    const snapshots: Map<string, Uint8Array> = OrchestratorHelper.getSnapshots(output);
    const labelResolvers: Map<string, LabelResolver> = await Orchestrator.getLabelResolversAsync(OrchestratorSettings.ModelPath, entityBaseModelPath, snapshots);

    try {
      let fullEmbeddings: boolean = false;
      if (process.env.fullEmbeddings) {
        fullEmbeddings = true;
      }
      Utility.toPrintDebuggingLogToConsole = flags.debug;
      OrchestratorSettings.init(cwd, flags.model, output, cwd);
      const retPayload: any = await Orchestrator.buildAsync(
        OrchestratorSettings.ModelPath,
        luInputs,
        labelResolvers,
        isDialog,
        entityBaseModelPath,
        luConfig,
        fullEmbeddings);
      OrchestratorHelper.writeBuildOutputFiles(output, retPayload);
      const settingsFile: string = path.join(output, 'orchestrator.settings.json');
      OrchestratorHelper.writeToFile(settingsFile, JSON.stringify(retPayload.settings, null, 2));
      this.log(`orchestrator.settings.json is written to ${settingsFile}`);
    } catch (error) {
      throw (new CLIError(error));
    }
  }
}

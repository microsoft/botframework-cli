/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, OrchestratorHelper, Utility} from '@microsoft/bf-orchestrator';
import {OrchestratorSettings} from '../../utils/settings';

export default class OrchestratorBuild extends Command {
  static description: string = 'Creates Orchestrator snapshot file and Orchestrator dialog definition file (optional) for each lu file in input folder'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to lu file or folder with lu files.'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator model.'}),
    out: flags.string({char: 'o', description: 'Path where Orchestrator snapshot/dialog file(s) will be placed. Default to current working directory.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    luconfig: flags.string({description: 'Path to luconfig.json.'}),
    dialog: flags.boolean({description: 'Generate multi language or cross train Orchestrator recognizers.'}),
    notToUseCompactEmbeddings: flags.boolean({description: 'Not to use compact embeddings.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h', description: 'Orchestrator build command help'}),
  }

  async run() {
    const {flags}: flags.Output = this.parse(OrchestratorBuild);
    const input: string = flags.in ? path.resolve(flags.in) : '';
    let output: string = path.resolve(flags.out || process.cwd());
    const isDialog: boolean = flags.dialog;
    let luConfig: any = null;
    let luConfigPath: string = flags.luconfig;

    if (luConfigPath && luConfigPath.length > 0) {
      luConfigPath = path.resolve(luConfigPath);
      luConfig = JSON.parse(OrchestratorHelper.readFile(luConfigPath));
    }

    Utility.toPrintDebuggingLogToConsole = flags.debug;
    const cwd: string = process.cwd();
    if (!OrchestratorHelper.isDirectory(output)) {
      output = path.dirname(output);
    }

    try {
      OrchestratorSettings.init(cwd, flags.model, output, cwd);
      const retPayload: any = await Orchestrator.buildAsync(
        OrchestratorSettings.ModelPath, 
        OrchestratorHelper.getLuInputs(input), 
        isDialog, 
        luConfig,
        flags.notToUseCompactEmbeddings);
      OrchestratorHelper.writeBuildOutputFiles(output, retPayload.outputs);
      const settingsFile: string = path.join(output, 'orchestrator.settings.json');
      OrchestratorHelper.writeToFile(settingsFile, JSON.stringify(retPayload.settings, null, 2));
      this.log(`orchestrator.settings.json is written to ${settingsFile}`);
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }
}

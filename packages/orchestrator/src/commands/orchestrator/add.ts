/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility, OrchestratorHelper} from '@microsoft/bf-orchestrator';
import {OrchestratorSettings, OrchestratorData} from '../../utils/settings';

export default class OrchestratorAdd extends Command {
  static description: string = 'Add examples from .lu/.qna/.json/.blu files, LUIS app(s) and QnaMaker kb(s) to Orchestrator snapshot file';

  static examples: Array<string> = [`	
    $ bf orchestrator:add 	
    $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/	
    $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/ --out ./path/to/output/	
    $ bf orchestrator:add --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model/directory
    $ bf orchestrator:add -t luis --id LUIS_APP_ID --version LUIS_APP_VERSION --key LUIS_KEY
    $ bf orchestrator:add -t qna --id QNA_KB  --key QNA_KB_SERVICE_KEY --routingname q_kb
    `]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to example file (.lu/.qna/.json/.blu).'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator model directory.'}),
    out: flags.string({char: 'o', description: 'Path where generated Orchestrator example file will be placed. Default to current working directory.'}),
    dialog: flags.boolean({description: 'Generate multi language or cross train Orchestrator recognizers.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    fullEmbeddings: flags.boolean({description: 'Use full embeddings.'}),
    id: flags.string({description: 'LUIS app id or QnAMaker kb id if type = luis/qna'}),
    key: flags.boolean({char: 'k', description: 'LUIS authoring key or QnAMaker service key if type = luis/qna'}),
    type: flags.string({char: 't', description: 'Type of input (luis/qna/file), default to file'}),
    version: flags.string({char: 'v', description: 'LUIS app version'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h', description: 'Orchestrator add command help'}),
  }

  async run() {
    const {flags}: flags.Output = this.parse(OrchestratorAdd);
    const cwd: string = process.cwd();
    let input: string = '';
    const output: string = flags.out;
    const isDialog: boolean = flags.dialog;
    const baseModelPath: string = flags.model;
    const entityBaseModelPath: string = flags.entityModel;
    const type: string = (flags.type.toLowerCase() || 'file');
    const id: string = (flags.id || '');
    const version: string = (flags.version || '');
    const key: string = (flags.key || '');

    Utility.toPrintDebuggingLogToConsole = flags.debug;
    Utility.debuggingLog(`type=${type}`);
    Utility.debuggingLog(`id=${id}`);
    Utility.debuggingLog(`key=${key}`);
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`entityBaseModelPath=${entityBaseModelPath}`);

    try {
      OrchestratorSettings.init(cwd, baseModelPath, entityBaseModelPath, output, cwd);
      const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(path.resolve(OrchestratorSettings.SnapshotPath));

      if (!Utility.isEmptyString(id) && !Utility.isEmptyString(key) && !Utility.isEmptyString(type) && type !== 'file') {
        input = OrchestratorAdd.getFileInput(new OrchestratorData(id, key, version, type, cwd));
        OrchestratorSettings.addInput(id, key, version, type, input);
      } else {
        input = path.resolve(flags.in || cwd);
      }

      await Orchestrator.addAsync(
        OrchestratorSettings.ModelPath,
        snapshot,
        OrchestratorHelper.getLuInputs(input),
        isDialog,
        entityBaseModelPath,
        flags.fullEmbeddings);
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }

  // eslint-disable-next-line max-params
  private static getFileInput(input: OrchestratorData): string {
    switch (input.type) {
    case 'luis':
      return OrchestratorAdd.getLuFileFromLuisApp(input);
    case 'qna':
      return OrchestratorAdd.getQnAFileFromQnaKb(input);
    default:
      throw new CLIError('Invalid input type');
    }
  }

  static getQnAFileFromQnaKb(input: OrchestratorData): string {
    throw new Error('Method not implemented.');
  }

  static getLuFileFromLuisApp(input: OrchestratorData): string {
    throw new Error('Method not implemented.');
  }
}

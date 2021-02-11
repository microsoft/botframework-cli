/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {LuisQnaHelper, Orchestrator, Utility, OrchestratorHelper} from '@microsoft/bf-orchestrator';
import {OrchestratorSettings, OrchestratorDataSource} from '../../utils/settings';

export default class OrchestratorAdd extends Command {
  static description: string = 'Add examples from .lu/.qna/.json/.blu files, LUIS app(s) and QnaMaker kb(s) to Orchestrator snapshot file';

  static examples: Array<string> = [`	
    $ bf orchestrator:add 	
    $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/	
    $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/ --out ./path/to/output/	
    $ bf orchestrator:add --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model/directory
    $ bf orchestrator:add -t luis --id LUIS_APP_ID --version LUIS_APP_VERSION --key LUIS_KEY --routingname l_Weather --endpoint 
    $ bf orchestrator:add -t qna --id QNA_KB  --key QNA_KB_SERVICE_KEY --routingname q_kb
    `]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to example file (.lu/.qna/.json/.blu).'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator model directory.'}),
    out: flags.string({char: 'o', description: 'Path where generated Orchestrator example file will be placed. Default to current working directory.'}),
    dialog: flags.boolean({description: 'Generate multi language or cross train Orchestrator recognizers.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    fullEmbeddings: flags.boolean({description: 'Use full embeddings.'}),
    id: flags.string({description: 'LUIS app id or QnAMaker kb id if type = luis/qna.'}),
    key: flags.string({char: 'k', description: 'LUIS authoring key or QnAMaker service key if type = luis/qna.'}),
    endpoint: flags.string({description: 'LUIS/QnAMaker endpoint.'}),
    type: flags.string({char: 't', description: 'Type of input (luis/qna/file)'}),
    routingName: flags.string({description: 'Routing name.'}),
    version: flags.string({char: 'v', description: 'LUIS app version'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h', description: 'Orchestrator add command help'}),
  }

  async run() {
    const {flags}: flags.Output = this.parse(OrchestratorAdd);
    const cwd: string = process.cwd();
    const inputPath: string = path.resolve(flags.in || cwd);
    const output: string = flags.out;
    const isDialog: boolean = flags.dialog;
    const baseModelPath: string = flags.model;
    const entityBaseModelPath: string = flags.entityModel;
    const type: string = (flags.type.toLowerCase() || '');
    const id: string = (flags.id || '');
    const endpoint: string = (flags.endpoint || '');
    const version: string = (flags.version || '');
    const key: string = (flags.key || '');
    const routingName: string = (flags.routingName || '');

    Utility.toPrintDebuggingLogToConsole = flags.debug;
    Utility.debuggingLog(`type=${type}`);
    Utility.debuggingLog(`id=${id}`);
    Utility.debuggingLog(`key=${key}`);
    Utility.debuggingLog(`baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`entityBaseModelPath=${entityBaseModelPath}`);
    Utility.debuggingLog(`routingName=${routingName}`);

    try {
      if (type.length > 0) {
        OrchestratorSettings.init(cwd, baseModelPath, entityBaseModelPath, output, true);
        await this.ensureDataSourceAsync(new OrchestratorDataSource(id, key, version, endpoint, type, routingName, inputPath));
      } else {
        OrchestratorSettings.init(cwd, baseModelPath, entityBaseModelPath, output);
        const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(path.resolve(OrchestratorSettings.SnapshotPath));
        const inputs: any = OrchestratorHelper.getLuInputs(inputPath);
        await Orchestrator.addAsync(
          OrchestratorSettings.ModelPath,
          snapshot,
          inputs,
          isDialog,
          entityBaseModelPath,
          flags.fullEmbeddings);
      }

      OrchestratorSettings.persist();
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }

  private async ensureDataSourceAsync(
    input: OrchestratorDataSource): Promise<any> {
    let content: string = '';

    try {
      switch (input.type) {
      case 'luis':
        content = await OrchestratorAdd.getLuFileFromLuisApp(input);
        if (content.length === 0) {
          throw new Error(`LUIS app id ${input.id} - subscriptionKey ${input.key} not found`);
        }
        break;
      case 'qna':
        content = await OrchestratorAdd.getQnAFileFromQnaKb(input);
        if (content.length === 0) {
          throw new Error(`Qna kb id ${input.id} - subscriptionKey ${input.key} not found`);
        }
        break;
      case 'file':
        // eslint-disable-next-line no-negated-condition
        if (!Utility.exists(input.filePath)) {
          throw new Error(`Input file ${input.filePath} not found`);
        }
        break;
      default:
        throw new Error('Invalid input type');
      }

      if (!OrchestratorSettings.hasDataSource(input)) {
        OrchestratorSettings.addUpdateDataSource(input);
      }

      if (content.length > 0) {
        if (OrchestratorHelper.isDirectory(input.filePath)) {
          if (!Utility.isEmptyString(input.routingName)) {
            input.filePath = path.join(input.filePath, input.routingName);
          } else if (input.type === 'luis') {
            input.routingName = LuisQnaHelper.getLuisAppNameFromLu(content);
            input.filePath = path.join(input.filePath, input.routingName + '.lu');
          } else if (input.type === 'qna') {
            input.routingName = LuisQnaHelper.getQnAKbNameFromQna(content);
            input.filePath = path.join(input.filePath, input.routingName + '.qna');
          } else {
            throw new Error(`Invalid file path ${input.filePath}`);
          }
        }
        fs.writeFileSync(input.filePath, content);
      }

      if (input.type === 'file') {
        this.log(`Added ${input.type} source  ${input.filePath}`);
      } else {
        this.log(`Added ${input.type} source with id ${input.id}`);
      }
    } catch (error) {
      throw new CLIError(error);
    }
  }

  static async getQnAFileFromQnaKb(input: OrchestratorDataSource, endpoint: string = ''): Promise<any> {
    const qna: any = await LuisQnaHelper.getQnaFromKb(input.id, input.key, endpoint);
    return qna;
  }

  static async getLuFileFromLuisApp(input: OrchestratorDataSource): Promise<string> {
    const lu: string  = await LuisQnaHelper.getLuFromLuisApp(input.endpoint, input.id, input.key, input.version);
    return lu;
  }
}

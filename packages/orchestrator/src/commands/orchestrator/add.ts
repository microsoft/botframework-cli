/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {DataSourceHelper, Orchestrator, OrchestratorDataSource, OrchestratorHelper, OrchestratorSettings, Utility} from '@microsoft/bf-orchestrator';

export default class OrchestratorAdd extends Command {
  static description: string = 'Add examples from .lu/.qna/.json/.blu files, LUIS app(s) and QnaMaker kb(s) to Orchestrator snapshot file.';

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
    entityModel: flags.string({char: 'e', description: 'Path to Orchestrator entity base model directory.'}),
    out: flags.string({char: 'o', description: 'Path where generated Orchestrator example file will be placed. Default to current working directory.'}),
    dialog: flags.boolean({description: 'Generate multi language or cross train Orchestrator recognizers.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    id: flags.string({description: 'LUIS app id or QnAMaker kb id if type = luis/qna.'}),
    key: flags.string({char: 'k', description: 'LUIS authoring key or QnAMaker service key if type = luis/qna.'}),
    endpoint: flags.string({description: 'LUIS/QnAMaker endpoint.'}),
    type: flags.string({char: 't', description: 'Type of input (luis/qna/file).'}),
    routingName: flags.string({description: 'Routing name, default to file name.'}),
    version: flags.string({char: 'v', description: 'Applies only for type=luis, LUIS app version'}),
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

    try {
      let fullEmbeddings: boolean = false;
      if (process.env.fullEmbeddings) {
        fullEmbeddings = true;
      }

      if (type.length > 0) {
        if (type === 'luis' && Utility.isEmptyString(endpoint)) {
          throw new CLIError('LUIS endpoint required, ie --endpoint https://westus.api.cognitive.microsoft.com');
        }
        OrchestratorSettings.init(cwd, baseModelPath, entityBaseModelPath, output, true);
        const dataSource: OrchestratorDataSource = new OrchestratorDataSource(id, key, version, endpoint, type, routingName, OrchestratorSettings.DataSources.path);
        await DataSourceHelper.ensureDataSourceAsync(dataSource, OrchestratorSettings.DataSources.path);

        if (dataSource.Type === 'file') {
          this.log(`Added ${dataSource.Type} source  ${dataSource.FilePath}`);
        } else {
          this.log(`Added ${dataSource.Type} source with id ${dataSource.Id}`);
        }
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
          fullEmbeddings);
      }

      OrchestratorSettings.persist();
    } catch (error) {
      throw (new CLIError(error));
    }
  }
}

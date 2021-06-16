/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, OrchestratorDataSource, OrchestratorSettings} from '@microsoft/bf-orchestrator';

export default class OrchestratorRemove extends Command {
  static description: string = 'Remove examples from LUIS app(s), QnaMaker kb(s) or .lu/.qna/.json files from Orchestrator snapshot file.';

  static examples: Array<string> = [`	
    $ bf orchestrator:remove 	
    $ bf orchestrator:remove -t luis --id LUIS_APP_ID 
    $ bf orchestrator:remove -t qna --id QNA_KB 
    $ bf orchestrator:remove -t file -i FILE_PATH 
    `]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to example file (.lu/.qna/.json/.blu).'}),
    id: flags.string({description: 'LUIS app id or QnAMaker kb id if type = luis/qna.'}),
    type: flags.string({char: 't', description: 'Type of input (luis/qna/file).'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h', description: 'Orchestrator remove command help'}),
  }

  async run() {
    const {flags}: flags.Output = this.parse(OrchestratorRemove);
    const cwd: string = process.cwd();
    const filePath: string = path.resolve(flags.in || cwd);
    const type: string = (flags.type.toLowerCase() || '');
    const id: string = (flags.id || '');

    if (!type) {
      throw new CLIError('Type parameter required');
    }

    try {
      const settings: OrchestratorSettings = OrchestratorSettings.getCurrent();
      settings.init(cwd, '', '', '', true, true);
      const dataSource: OrchestratorDataSource = new OrchestratorDataSource(id, '', '', '', type, '', filePath);
      if (Orchestrator.removeDataSource(dataSource)) {
        if (dataSource.Type === 'file') {
          this.log(`Removed ${dataSource.Type} source  ${dataSource.FilePath}`);
        } else {
          this.log(`Removed ${dataSource.Type} source with id ${dataSource.Id}`);
        }
      } else {
        this.log('Data source not found');
      }

      settings.persist();
    } catch (error) {
      throw (new CLIError(error));
    }
  }
}

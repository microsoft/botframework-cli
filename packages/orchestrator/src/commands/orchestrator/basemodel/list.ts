/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';

export default class OrchestratorBaseModelList extends Command {
  static description: string = 'Lists all Orchestrator base model versions'

  static flags: flags.Input<any> = {
    all: flags.boolean({description: 'Optional. Display all models', default: false}),
    help: flags.help({char: 'h', description: 'Orchestrator basemodel:list command help'}),
    raw: flags.boolean({char: 'r', description: 'Optional. Raw output', default: false}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorBaseModelList);
    const all: boolean = flags.all;
    Utility.toPrintDebuggingLogToConsole = flags.debug;

    try {
      const baseModels: any = await Orchestrator.baseModelListAsync(all);
      // eslint-disable-next-line no-negated-condition
      if (!flags.raw) {
        let output: any = all ? '\nAvailable base models:\n\n' : '\nDefault base models:\n\n';
        Object.getOwnPropertyNames(baseModels).forEach((key: any) => {
          output += `\n${key}\n`;
          output += `\t Version Id:   ${key}\n`;
          output += `\t Release date: ${baseModels[key].releaseDate}\n`;
          output += `\t Description:  ${baseModels[key].description}\n`;
        });
        this.log(output);
      } else {
        this.log(Utility.jsonStringify(baseModels, null, 2));
      }
    } catch (error) {
      throw (new CLIError(error));
    }

    return 0;
  }
}

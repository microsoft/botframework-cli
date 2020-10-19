/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';

export default class OrchestratorNlrList extends Command {
  static description: string = 'Lists all Orchestrator model versions'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Orchestrator nlr:list command help'}),
    raw: flags.boolean({char: 'r', description: 'Optional. Raw output', default: false}),
  }

  async run() {
    const {flags}: flags.Output = this.parse(OrchestratorNlrList);

    Utility.toPrintDebuggingLogToConsole = flags.debug;

    try {
      const nlrList: any = await Orchestrator.nlrGetVersionsAsync();
      // eslint-disable-next-line no-negated-condition
      if (!flags.raw) {
        let output: any = '\n\nAvailable models:\n\n';
        Object.getOwnPropertyNames(nlrList.models).forEach((key: any) => {
          output += `\n${key}\n`;
          output += `\t Version Id:   ${key}\n`;
          output += `\t Release date: ${nlrList.models[key].releaseDate}\n`;
          output += `\t Description:  ${nlrList.models[key].description}\n`;
        });
        this.log(output);
      } else {
        this.log(JSON.stringify(nlrList, null, 2));
      }
    } catch (error) {
      throw (new CLIError(error));
    }

    return 0;
  }
}

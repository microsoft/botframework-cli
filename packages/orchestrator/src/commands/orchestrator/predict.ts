/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'
import {Command, flags} from '@microsoft/bf-cli-command';

import * as path from 'path';

export default class OrchestratorPredict extends Command {
  static description = 'Returns score of given utterance using previously created orchestrator examples';

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run(): Promise<number> {
    const {flags} = this.parse(OrchestratorPredict);

    const input = flags.in || __dirname;
    const output = flags.out || __dirname;

    const args = `predict -i ${input} -o ${output}`;
    this.log(`arguments -- ${args}`);

    // TO-DO: figure out rush package dependency with regard to oclif folder structure
    // require("dotnet-3.1") statement works only for local package install
    // process.argv= [process.argv[0], process.argv[1], __dirname + '/netcoreapp3.1/OrchestratorCli.dll', ...process.argv.slice(2)]
    // require("dotnet-3.1")

    try {
      require('child_process').execSync('dotnet "' + path.join(...[__dirname, 'netcoreapp3.1', 'OrchestratorCli.dll']) + '" ' + args, {stdio: [0, 1, 2]});
    } catch (error) {
      return 1;
    }
    return 0;
  }
}

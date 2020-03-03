/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags} from '@microsoft/bf-cli-command'

export default class OrchestratorCreate extends Command {
  static description = 'Create orchestrator example file from .lu/.qna files, which represent bot modules'
  static examples = [`
    $ bf orchestrator:create 
    $ bf orchestrator:create --in ./path/to/file/
    $ bf orchestrator:create --in ./path/to/file/ -o ./path/to/output/`
  ]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'The path to .lu/.qna files from where orchestrator example file will be created from. Default to current working directory.'}),
    out: flags.string({char: 'o', description: 'Path where generated orchestrator example file will be placed. Default to current working directory.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    help: flags.help({char: 'h', description: 'Orchestrator create command help'})
  }

  async run() {
    const {flags} = this.parse(OrchestratorCreate)

    const input = flags.in || __dirname;
    const output = flags.out || __dirname;
    
    let args = `create -i ${input} -o ${output}`;
    this.log(`arguments -- ${args}`);

    // TODO: figure out rush package dependency with regard to oclif folder structure
    // require("dotnet-3.1") statement works only for local package install
    // process.argv= [process.argv[0], process.argv[1], __dirname + '/netcoreapp3.1/OrchestratorCli.dll', ...process.argv.slice(2)]
    // require("dotnet-3.1")

    try {
        require('child_process').execSync('dotnet "' + __dirname + '/netcoreapp3.1/OrchestratorCli.dll" ' + args, { stdio: [0, 1, 2] });
    } catch (err) {
        return 0;
    }
  }
}

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import * as utils from '../../utils';
import * as path from 'path';
import { setFlagsFromString } from 'v8';

export default class OrchestratorFinetune extends Command {
  static description: string = 'Manage Orchestrator fine tuning.';

  // eslint-disable-next-line @typescript-eslint/typedef
  static args=[
    {
      name: 'command', required: true, description:
      // eslint-disable-next-line no-multi-str
      'The "command" is the first mandatory argument.  This can be "status", "put" or "get".\n\
              status - Status of the last finetune training job.\n\
              put    - Put finetune training example data to improve orchestrator.\n\
              get    - Get the model for completed finetune job.',
    },
  ]

  static examples: string[] = [`
    $ bf orchestrator:finetune status
    $ bf orchestrator:finetune put --in ./path/to/file/
    $ bf orchestrator:finetune get --out ./path/to/output/`]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Orchestrator finetune command help'}),
    in: flags.string({char: 'i', description: 'If --push flag is provided, the path to .lu/.qna files from where orchestrator finetune example file will be created from. Default to current working directory.'}),
    hierarchical: flags.boolean({description: 'Add hierarchical labels based on lu/qna file name.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    out: flags.string({char: 'o', description: 'If --get flag is provided, the path where the new orchestrator finetune job will be created. Default to current working directory.'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator model.'}),
  }

  async run(): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/typedef
    const {args, flags} = this.parse(OrchestratorFinetune);
    const input: string  = flags.in || __dirname;
    const output: string = flags.out || __dirname;
    const hierarchical: boolean = flags.hierachical || false;
    let nlrPath: string = flags.model;
    if (nlrPath) {
      nlrPath = path.resolve(nlrPath);
    }

    let cli_args: string = `finetune ${args.command} `;
    switch (args.command) {
    case 'status': {
      break;
    }
    case 'get': {
      if (flags.out === undefined) {
        this.warn('No output directory directory given. Using current nlr path.');
      } else {
        cli_args += `--out ${output}`;
      }
      break;
    }
    case 'put': {
      if (flags.in === undefined)  {
        this.error('Missing 1 required arg:\nPlease pass a file or folder location with --in flag.');
        return 2;
      }
      const combinedFile: string = await this.writeOutputFile(input, hierarchical, output);

      cli_args += `--in ${combinedFile}`;
      break;
    }
    default: {
      this.error(`Command "${args.command}" unknown.\n${OrchestratorFinetune.args[0].description}`);
      return 1;
    }
    }

    if (nlrPath) {
      cli_args += ` --model ${nlrPath}`;
    }

    this.log(`Command -- ${path.join(...[__dirname, 'netcoreapp3.1', 'OrchestratorCli.dll'])} ${cli_args}`);

    try {
      require('child_process').execSync('dotnet "' + path.join(...[__dirname, 'netcoreapp3.1', 'OrchestratorCli.dll']) + '" ' + cli_args, {stdio: [0, 1, 2]});
    } catch (error) {
      return 1;
    }
    return 0;
  }

  private async writeOutputFile(input: string, hierachical: boolean, output: string): Promise<string> {
    const tsvFilePath: string = path.join(output, 'create.tsv');
    let tsvContent: string = '';
    try {
      utils.OrchestratorHelper.deleteFile(tsvFilePath);
      tsvContent = await utils.OrchestratorHelper.getTsvContent(input, hierachical, true);
      if (tsvContent.length === 0) {
        const errorMsg: string  = 'Invalid input';
        this.log(errorMsg);
        throw new CLIError(errorMsg);
      }
      utils.OrchestratorHelper.writeToFile(tsvFilePath, tsvContent);
    } catch (error) {
      throw new CLIError('Unable to write file - ' + tsvFilePath + ' Error: ' + error.message);
    }
    return tsvFilePath;
  }
}

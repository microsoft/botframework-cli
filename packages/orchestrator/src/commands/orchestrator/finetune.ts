/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import * as utils from '../../utils';
import * as path from 'path';
import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;

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
    $ bf orchestrator:finetune put --in ./path/to/file/ [--nlrversion <model version> | --logformat <logformat>]
    $ bf orchestrator:finetune get [--out ./path/to/output/]`]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'Orchestrator finetune command help'}),
    in: flags.string({char: 'i', description: 'If --input is provided, the path to .lu/.qna files from where orchestrator finetune example file will be created from. Default to current working directory.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    logformat: flags.string({char: 'l', description: '(Optional) If --logformat is provided, overrides the log file formats (Supported: labelText, dteData).'}),
    nlrversion: flags.string({char: 'n', description: '(Optional) If --nlrversion is provided, overrides the nlr version (Supported: 4.8.0, 4.8.0-multilingual).'}),
    out: flags.string({char: 'o', description: 'If --get flag is provided, the path where the new orchestrator finetune job will be created. Default to current working directory.'}),
    model: flags.string({char: 'm', description: 'Path to Orchestrator model.'}),
    debug: flags.boolean({char: 'd'}),
  }

  async run(): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/typedef
    const {args, flags} = this.parse(OrchestratorFinetune);
    const input: string  = flags.in || __dirname;
    const output: string = flags.out || __dirname;
    let nlrPath: string = flags.model;
    if (nlrPath) {
      nlrPath = path.resolve(nlrPath);
    }

    let cli_args: string = `finetune ${args.command} `;
    switch (args.command) {
    case 'status': {
      // Do nothing!
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

      // Validate log format
      let logformat: string = await this.getLogFormat(flags.logformat, input);
      let uploadFile: string;
      if (logformat === '') {
        uploadFile = await this.writeOutputFile(input, output);
        logformat = 'dteData';
      } else {
        uploadFile = input;
      }
      // Validate nlr version
      const nlrversion: string = await this.getNlrVersion(flags.nlrversion);

      cli_args += `--in ${uploadFile} --logformat ${logformat} --nlrversion ${nlrversion}`;
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

    if (flags.debug) {
      this.log(`Command -- ${path.join(...[__dirname, 'netcoreapp3.1', 'OrchestratorCli.dll'])} ${cli_args}`);
    }

    try {
      require('child_process').execSync('dotnet "' + path.join(...[__dirname, 'netcoreapp3.1', 'OrchestratorCli.dll']) + '" ' + cli_args, {stdio: [0, 1, 2]});
    } catch (error) {
      return 1;
    }
    return 0;
  }

  private async getLogFormat(logFormat: string, inputFile: string): Promise<string> {
    const validFormats: {[lowercaseformat: string]: string} = {
      dtedata: 'dteData',
      labeltext: 'labelText',
    };
    if (!logFormat) {
      return ''; // Assume it's a standard format.
    }
    fs.access(inputFile, fs.constants.R_OK, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        throw new CLIError('Unable to read file - ' + inputFile + ' Error: ' + err);
      }
    });
    if (logFormat.toLowerCase() in validFormats) {
      return validFormats[logFormat.toLowerCase()];
    }
    if (logFormat) {
      throw new CLIError('Invalid log format provided.  Must be dteData or labelText');
    }
    return '';
  }

  private async getNlrVersion(nlrVersion: string): Promise<string> {
    const validVersions: string[] =
    [
      '4.8.0',
      '4.8.0-multilingual',
    ];

    if (!nlrVersion) {
      return '4.8.0';
    }
    const lower: string = nlrVersion.toLowerCase();
    if (validVersions.includes(lower)) {
      return lower;
    }
    if (nlrVersion) {
      throw new CLIError('Invalid nlr version provided.  Must be 4.8.0 or 4.8.0-multilingual');
    }
    return '4.8.0';
  }

  private async writeOutputFile(input: string, output: string): Promise<string> {
    const tsvFilePath: string = path.join(output, 'create.tsv');
    let tsvContent: string = '';
    try {
      utils.OrchestratorHelper.deleteFile(tsvFilePath);
      tsvContent = await utils.OrchestratorHelper.getTsvContent(input, false, true);
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

/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
/* eslint-disable node/no-missing-require */
/* eslint-disable @typescript-eslint/typedef */
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {getContentFromFile} from '../../utils';
const fs = require('fs-extra');
const file = require('@microsoft/bf-lu/lib/utils/filehelper');

export default class OrchestratorDiscovery extends Command {
  static description: string = 'OrchestratorDiscovery';

  static orchestratorRecognizer = 'Microsoft.OrchestratorRecognizer'

  static examples: Array<string> = [`	
    $ bf orchestrator:discovery 	
    `]

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h', description: 'orchestrator:discovery command help'}),
    in: flags.string({char: 'i', description: '(required) The of bot dialog files folder'}),
    log: flags.boolean({description: 'Writes out log messages to console', default: false}),
    out: flags.string({char: 'o', description: 'Output folder name to write out .json file of discovered orchestrator models. If not specified, application setting will be output to console'}),
  }

  async run() {
    try {
      const {flags}: flags.Output = this.parse(OrchestratorDiscovery);
      let files: string[] = [];
      flags.stdin = await this.readStdin();

      if (!flags.stdin && !flags.in) {
        throw new CLIError('Missing input. Please use stdin or pass a file or folder location with --in flag');
      }

      if ((flags.in && flags.in !== '')) {
        if (flags.log) this.log('Loading files...\n');

        // get lu files from in.
        if (flags.in && flags.in !== '') {
          const dialogFiles = await file.getLuDialogFiles(flags.in, true);
          files.push(...dialogFiles);
        }

        // de-dupe the files list
        files = [...new Set(files)];
        const orchestratorsDialogs: {dialog: string; language: string}[] = [];
        for (let i = 0; i < files.length; i++) {
          const dialogContent = await getContentFromFile(files[i]);
          const luDialog = JSON.parse(dialogContent);
          if (luDialog.$kind === OrchestratorDiscovery.orchestratorRecognizer) {
            const dialogName = path.parse(files[i]).base;
            const nameWithLocale = dialogName.substr(0, dialogName.length - 10);
            const nameLocaleSegments = nameWithLocale.split('.');
            if (nameLocaleSegments.length === 1) {
              orchestratorsDialogs.push({dialog: nameLocaleSegments[0] + '.dialog', language: ''});
            } else if (nameLocaleSegments.length === 2) {
              orchestratorsDialogs.push({dialog: nameLocaleSegments[0] + '.dialog', language: nameLocaleSegments[1]});
            }
          }
        }

        const result = {Orchestrator: orchestratorsDialogs};

        // write dialog assets based on config
        if (flags.out) {
          const outputFolder = path.resolve(flags.out);
          await fs.writeFile(outputFolder, JSON.stringify(result), 'utf-8');
          this.log(`Successfully wrote .json files to ${outputFolder}\n`);
        } else {
          this.log('Dialogs using Luis Recognizers:');
          this.log(JSON.stringify(result, null, 4));
        }
      }
    } catch (error) {
      throw (new CLIError(error));
    }
  }
}

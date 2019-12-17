/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { CLIError, Command, flags } from '@microsoft/bf-cli-command'
import { LuBuildCore } from '../../parser/lubuild/core'
import { LUISConfig, Content } from '../../parser/lubuild/types'
const path = require('path');
const fs = require('fs-extra');
const fileHelper = require('./../../utils/filehelper');
const fileExtEnum = require('./../../parser/utils/helpers').FileExtTypeEnum
const LuisBuilder = require('./../../parser/luis/luisBuilder')

export default class LuisBuild extends Command {
  static description = 'Build lu files to train and publish luis applications'

  static examples = [`
    $ bf luis:build --in {INPUT_FILE_OR_FOLDER} --authoringkey {AUTHORING_KEY} --botname {BOT_NAME} --dialog {true}
  `]

  static flags: any = {
    help: flags.help({ char: 'h' }),
    in: flags.string({ char: 'i', description: 'Lu file or folder', required: true }),
    authoringkey: flags.string({ description: 'LUIS authoring key', required: true }),
    botname: flags.string({ description: 'Bot name', required: true }),
    out: flags.string({ description: 'Output location' }),
    culture: flags.string({ description: 'Culture code for the content. Infer from .lu if available. Defaults to en-us' }),
    region: flags.string({ description: 'LUIS authoring region' }),
    suffix: flags.string({ description: 'Environment name as a suffix identifier to include in LUIS app name' }),
    force: flags.boolean({ char: 'f', description: 'Force write dialog and settings files', default: false }),
    dialog: flags.boolean({ description: 'Write out .dialog files', default: false }),
    fallbacklocale: flags.string({ description: 'Locale to be used at the fall back if no locale specific recognizer is found. Only valid if --dialog is set' })
  }

  async run() {
    const { flags } = this.parse(LuisBuild)

    flags.culture = flags.culture && flags.culture !== '' ? flags.culture : 'en-us';
    flags.region = flags.region && flags.region !== '' ? flags.region : 'westus';
    flags.suffix = flags.suffix && flags.suffix !== '' ? flags.suffix : 'development';
    flags.fallbacklocale = flags.fallbacklocale && flags.fallbacklocale !== '' ? flags.fallbacklocale : 'en-us'
 
    const luContents: Array<Content> = [];
    let multiRecognizerDialogPath: string = '';
    let luisSettingsPath: string = '';

    process.stdout.write('Start to load lu files\n');
    let files = await fileHelper.getLuFiles(flags.in, true, fileExtEnum.LUFile);

    for (const file of files) {
      let fileCulture: string;
      let fileName: string;
      const luFiles = await fileHelper.getLuObjects(undefined, file, true, fileExtEnum.LUFile);
      const result = await LuisBuilder.build(luFiles, true, flags.culture);
      const fileContent = result.parseToLuContent();
      process.stdout.write(`${file} loaded\n`);
      let cultureFromPath = fileHelper.getCultureFromPath(file);
      if (cultureFromPath) {
        fileCulture = cultureFromPath;
        let fileNameWithCulture = path.basename(file, path.extname(file));
        fileName = fileNameWithCulture.substring(0, fileNameWithCulture.length - fileCulture.length - 1);
      } else {
        fileCulture = flags.culture;
        fileName = path.basename(file, path.extname(file));
      }

      if (multiRecognizerDialogPath === '') {
        multiRecognizerDialogPath = path.join(path.dirname(file), `${fileName}.lu.dialog`);
      }

      if(luisSettingsPath === '') {
        luisSettingsPath = path.join(path.dirname(file), `luis.settings.${flags.suffix}.${flags.region}.json`);
      }

      luContents.push(new Content(fileName, file, fileContent, fileCulture));
    }

    let multiRecognizerFileContent: any = {
      "$type": "Microsoft.MultiLanguageRecognizer",
      "recognizers": {
      }
    }

    if (fs.existsSync(multiRecognizerDialogPath)) {
      multiRecognizerFileContent = JSON.parse(await fileHelper.getContentFromFile(multiRecognizerDialogPath));
      process.stdout.write(`${multiRecognizerDialogPath} loaded\n`);
    }

    let multiRecognizerContent = new Content(path.basename(multiRecognizerDialogPath), multiRecognizerDialogPath, JSON.stringify(multiRecognizerFileContent));

    let luisSettingsFileContent: any = {
      "luis": {
      }
    }

    if (fs.existsSync(luisSettingsPath)) {
      luisSettingsFileContent = JSON.parse(await fileHelper.getContentFromFile(luisSettingsPath));
      process.stdout.write(`${luisSettingsPath} loaded\n`);
    }

    let luisSettingsContent = new Content(path.basename(luisSettingsPath), luisSettingsPath, JSON.stringify(luisSettingsFileContent));

    const luConfig: LUISConfig = new LUISConfig(
      flags.authoringkey,
      flags.botname,
      flags.culture,
      flags.region,
      flags.suffix,
      flags.dialog,
      flags.fallbacklocale,
      luContents,
      multiRecognizerContent,
      luisSettingsContent);

    process.stdout.write(`Start to handle applications\n`);
    const { recognizers, multiRecognizer, luisSettings } = await LuBuildCore.CreateOrUpdateApplication(luConfig);

    if (flags.dialog) {
      const dialogFileContent = await LuBuildCore.GenerateDeclarativeAssets(recognizers, multiRecognizer, luisSettings);
      const contents = dialogFileContent.Contents;
      for (const content of contents) {
        if (flags.out) {
          process.stdout.write(`Writing to ${content.Path}\n`);
          await fs.writeFile(path.join(flags.out, path.basename(content.Path)), content.Content, 'utf-8');
        } else {
          if (flags.force || !fs.existsSync(content.Path)) {
            process.stdout.write(`Writing to ${content.Path}\n`);
            await fs.writeFile(content.Path, content.Content, 'utf-8');
          }
        }
      }
    }

    process.stdout.write(`All tasks done\n`);
  }
}

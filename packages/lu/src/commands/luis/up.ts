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

export default class LuisUp extends Command {
  static description = 'Build lu files and train and publish luis applications'

  static examples = [`
    $ bf luis:up --in {INPUT_FILE_OR_FOLDER} --authoringkey {AUTHORING_KEY} --botname {BOT_NAME} --dialog {true}
  `]

  static flags: any = {
    help: flags.help({ char: 'h' }),
    in: flags.string({ char: 'i', description: 'lu file or folder' }),
    authoringkey: flags.string({ description: 'LUIS authoring key' }),
    botname: flags.string({ description: 'bot name' }),
    out: flags.string({ description: '[Optional] output location' }),
    culture: flags.string({ description: '[Optional] culture code for the content. Infer from .lu if available. Defaults to en-us', default: 'en-us' }),
    authoringregion: flags.string({ description: '[Optional] LUIS authoring region', default: 'westus' }),
    environmentname: flags.string({ description: '[Optional] environment name to include in LUIS app name', default: 'dev' }),
    force: flags.boolean({ description: '[Optional] force write dialog and settings files', default: false }),
    dialog: flags.boolean({ description: '[Optional] write out .dialog files', default: false }),
    fallbacklocale: flags.string({ description: '[Optional] locale to be used at the fall back if no locale specific recognizer is found. Only valid if --dialog is set', default: 'en-us' })
  }

  async run() {
    const { flags } = this.parse(LuisUp)

    const luContents: Array<Content> = [];
    let multiRecognizerDialogPath: string = '';
    let luisSettingsPath: string = '';

    if (flags.in === undefined) {
      throw new CLIError('No lu file or folder is provided!');
    }

    if (flags.authoringkey === undefined) {
      throw new CLIError('No authoring key is provided!');
    }

    if (flags.botname === undefined) {
      throw new CLIError('No bot name is provided!');
    }

    process.stdout.write('Start to load lu files\n');
    let files = await fileHelper.getLuFiles(flags.in, false, fileExtEnum.LUFile);

    for (const file of files) {
      let fileCulture: string;
      let fileName: string;
      const fileContent = await fileHelper.getContentFromFile(file);
      process.stdout.write(`${file} loaded\n`);
      let cultureFromPath = this.getCultureFromPath(file);
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
        luisSettingsPath = path.join(path.dirname(file), `luis.settings.${flags.environmentname}.${flags.authoringregion}.json`);
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
      flags.authoringregion,
      flags.environmentname,
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

  getCultureFromPath(file: string): string | null {
    let fn = path.basename(file, path.extname(file));
    let lang = path.extname(fn).substring(1);
    switch (lang.toLowerCase()) {
      case 'en-us':
      case 'zh-cn':
      case 'nl-nl':
      case 'fr-fr':
      case 'fr-ca':
      case 'de-de':
      case 'it-it':
      case 'ja-jp':
      case 'ko-kr':
      case 'pt-br':
      case 'es-es':
      case 'es-mx':
      case 'tr-tr':
        return lang;
      default:
        return null;
    }
  }
}

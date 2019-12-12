/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { CLIError, Command, flags } from '@microsoft/bf-cli-command'
import { LuBuildCore } from '../../parser/lubuild/lubuildCore'
import { LUISConfig, Content } from '../../parser/lubuild/lubuildClasses'
const path = require('path');
const fs = require('fs-extra');
const fileHelper = require('./../../utils/filehelper');
const fileExtEnum = require('./../../parser/utils/helpers').FileExtTypeEnum

export default class LuisUp extends Command {
  static description = 'Build lu files and train and publish luis applications'

  static examples = [`
    $ bf luis:up --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
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
    force: flags.boolean({ description: 'force write dialog and settings files', default: false }),
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

    let files = fileHelper.getLuFiles(flags.in, false, fileExtEnum.LUFile);

    files.forEach((file: any) => {
      
        let fileCulture: string;
        let fileName: string;
        const fileContent = fileHelper.getContentFromFile(file);
        let cultureFromPath = this.getCultureFromPath(file);
        if (cultureFromPath) {
          fileCulture = cultureFromPath;
          let fileNameWithCulture = path.basename(file, path.extname(file));
          fileName = fileNameWithCulture.substring(0, fileNameWithCulture.length - fileCulture.length - 1);
        } else {
          fileCulture = flags.culture;
          fileName = path.basename(file, path.extname(file));
          multiRecognizerDialogPath = path.join(path.dirname(file), `${fileName}.lu.dialog`);
          luisSettingsPath = path.join(path.dirname(file), `luis.settings.${flags.environmentname}.${flags.authoringregion}.json`);
        }

        luContents.push(new Content(fileName, file, fileContent, fileCulture));
      })

    const luConfig: LUISConfig = new LUISConfig(
      flags.authoringkey,
      flags.botname,
      flags.culture,
      flags.authoringregion,
      flags.environmentname,
      flags.dialog,
      flags.fallbacklocale,
      luContents,
      multiRecognizerDialogPath,
      luisSettingsPath);

    const { recognizers, multiRecognizer, luisSettings } = await LuBuildCore.CreateOrUpdateApplication(luConfig);

    if (flags.force || flags.dialog) {
      const dialogFileContent = await LuBuildCore.GenerateDeclarativeAssets(recognizers, multiRecognizer, luisSettings);
      const contents = dialogFileContent.Contents;
      for (const content of contents) {
        if (flags.out) {
          await fs.writeFile(path.join(flags.out, path.basename(content.Path)), content.Content, 'utf-8');
        } else {
          await fs.writeFile(content.Path, content.Content, 'utf-8');
        }
      }
    }
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

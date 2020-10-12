/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError} from '@microsoft/bf-cli-command';
const fs: any = require('fs-extra');
const path: any = require('path');
const FileHelper: any = require('@microsoft/bf-lu/lib/utils/fileHelper');
const FileExtEnum: any = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum;
const LuOptions: any = require('@microsoft/bf-lu/lib/parser/lu/luOptions');
const LuContent: any = require('@microsoft/bf-lu/lib/parser/lu/lu');
const LuisCollate: any = require('@microsoft/bf-lu/lib/parser/luis/luisCollate');
const Luis: any = require('@microsoft/bf-lu/lib/parser/luis/luis');

export class Helper {
  public static async readLuContents(fileOrFolderPath: string) {
    try {
      const luContents: any[] = [];
      const files: string[] = await FileHelper.getLuFiles(fileOrFolderPath, true, FileExtEnum.LUFile);
      /* eslint-disable no-await-in-loop */
      for (const file of files) {
        let luObjects: any[] = await FileHelper.getLuObjects('', file, true, FileExtEnum.LUFile);
        luObjects = luObjects.filter((file: any) => file.content !== '');

        let fileContent: string = '';
        if (luObjects.length <= 0) {
          const luContent: any = new LuContent(fileContent, new LuOptions(file));
          luContents.push(luContent);
          continue;
        }

        let result: any;
        try {
          result = await LuisCollate.build(luObjects, false);
          const luisObj: any = new Luis(result);
          fileContent = luisObj.parseToLuContent();
        } catch (error) {
          if (error.source) {
            error.text = `Invalid LU file ${error.source}: ${error.text}`;
          } else {
            error.text = `Invalid LU file ${file}: ${error.text}`;
          }
          throw new CLIError(error.text);
        }

        const content: any = new LuContent(fileContent, new LuOptions(file));
        luContents.push(content);
      }

      return luContents;
    } catch (error) {
      throw new CLIError(error);
    }
  }

  public static async writeLuContents(luContents: any[], out: string) {
    try {
      await Promise.all(luContents.map(async (luContent: any) => {
        let outFilePath: any;
        if (out) {
          outFilePath = path.join(path.resolve(out), path.basename(luContent.id));
        } else {
          outFilePath = luContent.id;
        }

        await fs.writeFile(outFilePath, luContent.content, 'utf-8');
      }));
    } catch (error) {
      throw new CLIError(error);
    }
  }
}

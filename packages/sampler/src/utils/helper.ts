/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError} from '@microsoft/bf-cli-command';
const fs = require('fs-extra');
const path = require('path');
const FileHelper = require('@microsoft/bf-lu/lib/utils/fileHelper');
const FileExtEnum = require('@microsoft/bf-lu/lib/parser/utils/helpers').FileExtTypeEnum;
const LuOptions = require('@microsoft/bf-lu/lib/parser/lu/luOptions');
const LuContent = require('@microsoft/bf-lu/lib/parser/lu/lu');
const LuisCollate = require('@microsoft/bf-lu/lib/parser/luis/luisCollate');
const Luis = require('@microsoft/bf-lu/lib/parser/luis/luis');

export class Helper {
  public static async readLuContents(fileOrFolderPath: string) {
    try {
      let luContents: any[] = [];
      const files = await FileHelper.getLuFiles(fileOrFolderPath, true, FileExtEnum.LUFile);
      for (const file of files) {
        let luObjects = await FileHelper.getLuObjects('', file, true, FileExtEnum.LUFile);
        luObjects = luObjects.filter((file: any) => file.content !== '');

        let fileContent = '';
        if (luObjects.length <= 0) {
          const luContent = new LuContent(fileContent, new LuOptions(file));
          luContents.push(luContent);
          continue;
        }

        let result: any;
        try {
          result = await LuisCollate.build(luObjects, false);
          let luisObj = new Luis(result);
          fileContent = luisObj.parseToLuContent();
        } catch (err) {
          if (err.source) {
            err.text = `Invalid LU file ${err.source}: ${err.text}`;
          } else {
            err.text = `Invalid LU file ${file}: ${err.text}`;
          }
          throw new CLIError(err.text);
        }

        const content = new LuContent(fileContent, new LuOptions(file));
        luContents.push(content);
      }

      return luContents;
    } catch (error) {
      throw new CLIError(error);
    }
  }

  public static async writeLuContents(luContents: any[], out: string) {
    try {
      await Promise.all(luContents.map(async luContent => {
        let outFilePath: any;
        if (out) {
          outFilePath = path.join(path.resolve(out), path.basename(luContent.id));
        } else {
          outFilePath = luContent.id;
        }

        await fs.writeFile(outFilePath, luContent.content, 'utf-8');
      }))
    } catch (error) {
      throw new CLIError(error);
    }
  }
}
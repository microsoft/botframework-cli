import { CLIError, Command, flags } from '@microsoft/bf-cli-command'
const exception = require('./../../parser/utils/exception')
const fs = require('fs-extra')
const path = require('path')
const file = require('./../../utils/filehelper')
const fileExtEnum = require('./../../parser/utils/helpers').FileExtTypeEnum
const interuptionConverter = require('./../../parser/converters/interuptionconverter')

export default class LuisCrossTrian extends Command {
  static description = 'Convert interuption intents among .lu file(s)'

  static flags: flags.Input<any> = {
    in: flags.string({ description: 'Source .lu file(s)' }),
    root: flags.string({ description: 'root lu files to do cross training' }),
    recurse: flags.boolean({ description: 'Indicates if sub-folders need to be considered to file .lu file(s)', default: false }),
    log: flags.boolean({ description: 'Enables log messages', default: false }),
    out: flags.string({ description: 'Output folder name. If not specified will update the folder of source lg file(s)' }),
    intentname: flags.string({ description: 'interuption intent name', default: '_Interuption' }),
  }

  async run() {
    try {
      const { flags } = this.parse(LuisCrossTrian)

      //Check if file or folder
      //if folder, only lu to luis is supported
      const isLu = await file.detectLuContent(undefined, flags.in)

      // Parse the object depending on the input
      let result: any
      if (isLu && flags.root) {
        const luFiles = await file.getLuObjects(undefined, flags.in, flags.recurse, fileExtEnum.LUFile);
        const rootFiles = await file.getLuObjects(undefined, flags.root);
        const luConfigObject = await file.getConfigObject(flags.in, flags.recurse);
        result = await interuptionConverter.convertInteruption(luFiles, rootFiles, luConfigObject, flags.intentname, flags.log);
      } 

      // If result is null or undefined return
      if (!result) {
        throw new CLIError('No LU or Luis content parsed!')
      }

      await this.writeLuFiles(result, flags);
    } catch (err) {
      if (err instanceof exception) {
        throw new CLIError(err.text)
      }
      throw err
    }
  }

  private async writeLuFiles(fileIdToLuResourceMap: Map<string, any>, flags?: any) {
    let newFolder;
    if (flags && flags.out) {
      newFolder = flags.out
      if (!path.isAbsolute(flags.out)) {
        newFolder = path.resolve(flags.out);
      }

      if (!fs.existsSync(newFolder)) {
        fs.mkdirSync(newFolder);
      }
    }

    for (const fileId of fileIdToLuResourceMap.keys()) {
      try {
        if (newFolder) {
          const fileName = path.basename(fileId);
          const newFileId = path.join(newFolder, fileName);
          await fs.writeFile(newFileId, fileIdToLuResourceMap.get(fileId).Content, 'utf-8');
          this.log('Successfully wrote LUIS model to ' + newFileId);
        } else {
          await fs.writeFile(fileId, fileIdToLuResourceMap.get(fileId).Content, 'utf-8');
          this.log('Successfully wrote LUIS model to ' + fileId);
        }
      } catch (err) {
        throw new CLIError('Unable to write file - ' + fileId + ' Error: ' + err.message);
      }
    }
  }
}

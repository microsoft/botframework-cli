import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
const exception = require('./../../../parser/lufile/classes/exception')
const fs = require('fs-extra')
const path = require('path')
const helpers = require('./../../../parser/lufile/helpers')
const luConverter = require('./../../../parser/converters/lutoluisconverter')
const luisConverter = require('./../../../parser/converters/luistoluconverter')

export default class LuisConvert extends Command {
  static description = 'Convert .lu file(s) to a LUIS application JSON model or vice versa'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source .lu file(s) or LUIS application JSON model', required: true}),
    recurse: flags.boolean({description: 'Indicates if sub-folders need to be considered to file .lu file(s)', default: false}),
    log: flags.boolean({description: 'Enables log messages', default: false}),
    out: flags.string({description: 'Output file or folder name. If not specified stdout will be used as output'}),
    name: flags.string({description: 'Name of the LUIS application'}),
    description: flags.string({description: 'Text describing the LUIS applicaion'}),
    culture: flags.string({description: 'Lang code for the LUIS application'}),
    versionid: flags.string({description: 'Version ID of the LUIS application'}),
    schemaversion: flags.string({description: 'Schema version of the LUIS application'}),
  }

  inputStat: any

  async run() {
    try {
      const {flags} = this.parse(LuisConvert)
      //Check if file or folder
      //if folder, only lu to luis is supported
      this.inputStat = await fs.stat(flags.in)
      let isLu = !this.inputStat.isFile() ? true : path.extname(flags.in) === '.lu'

       // Parse the object depending on the input
      let result: any
      if (isLu) {
        let luFiles = await this.getLuFiles(flags.in, flags.recurse)
        result = await luConverter.parseLuToLuis(luFiles, flags.log, flags.culture)
      } else {
        result = await luisConverter.parseLuisToLu(flags.in)
      }

      // If result is null or undefined return
      if (!result) {
        throw new CLIError('No LU or Luis content parsed!')
      }

       // Add headers to Luis Json
      if (isLu) {
        result.luis_schema_version = flags.schemaversion || result.luis_schema_version || '3.2.0'
        result.versionId = flags.versionId || result.versionId || '0.1'
        result.name = flags.name || result.name || ''
        result.desc = flags.desc || result.desc || ''
        result.culture = flags.culture || result.culture || 'en-us'
        result.culture = result.culture.toLowerCase()
        result = JSON.stringify(result, null, 2)
      }

      // Print or write the parsed object
      if (flags.out) {
        await this.writeOutput(result, flags, isLu)
      } else {
        this.log(result)
      }
    } catch (err) {
      if (err instanceof exception) {
        throw new CLIError(err.text)
      }
      throw err
    }
  }

  private async getLuFiles(input: string | undefined, recurse = false): Promise<Array<any>> {
    let filesToParse = []

    if (this.inputStat.isFile()) {
      filesToParse.push(input)
      return filesToParse
    }

    if (!this.inputStat.isDirectory()) {
      throw new CLIError('Sorry, ' + input + ' is not a folder or does not exist')
    }

    filesToParse = helpers.findLUFiles(input, recurse)

    if (filesToParse.length === 0) {
      throw new CLIError('Sorry, no .lu files found in the specified folder.')
    }
    return filesToParse
  }

  private async writeOutput(convertedObject: any, flags: any, isLu: boolean) {
    let filePath = await this.generateNewFilePath(flags.out, flags.in, isLu)
    // write out the final file
    try {
      await fs.writeFile(filePath, convertedObject, 'utf-8')

    } catch (err) {
      throw new CLIError('Unable to write file - ' + filePath + ' Error: ' + err.message)
    }
    this.log('Successfully wrote LUIS model to ' + filePath + '\n')
  }

  private async generateNewFilePath(outFileName: string, inputfile: string, isLu: boolean): Promise<string> {
    let extension = path.extname(outFileName)
    if (extension === '.json' || extension === '.lu') {
      return path.join(process.cwd(), outFileName)
    }

    let base = path.join(process.cwd(), outFileName)
    await fs.mkdirp(base)
    let name
    if (this.inputStat.isFile()) {
      name = path.basename(inputfile, path.extname(inputfile)) + (isLu ? '.json' : '.lu')
    } else {
      name = isLu ? 'lufile.lu' : 'luisapp.json'
    }
    return path.join(base, name)
  }
}

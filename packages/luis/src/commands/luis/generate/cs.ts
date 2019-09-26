import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import {camelCase, upperFirst} from 'lodash'
import * as path from 'path'

import {LuisToCsConverter} from '../../../parser/converters/luis-to-cs-converter'
import {Utils} from '../../../utils'

const fs = require('fs-extra')

export default class LuisGenerateCs extends Command {
  static description = 'Generate:cs generates a strongly typed C# source code from an exported (json) LUIS model.'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source .lu file(s) or LUIS application JSON model'}),
    out: flags.string({description: 'Output file or folder name. If not specified stdout will be used as output', default: ''}),
    className: flags.string({description: 'Name of the class'}),
  }

  reorderEntities(app: any, name: string): void {
    if (app[name] !== null && app[name] !== undefined) {
      app[name].sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
    }
  }

  async run() {
    try {
      const {flags} = this.parse(LuisGenerateCs)
      let space = 'Luis'
      let stdInput = await this.readStdin()

      const pathPrefix = path.isAbsolute(flags.in) ? '' : process.cwd()
      const app = stdInput ? JSON.parse(stdInput as string) : await fs.readJSON(path.join(pathPrefix, flags.in))

      flags.className = flags.className || app.name
      flags.className = upperFirst(camelCase(flags.className))

      const dot_index = flags.className ? flags.className.indexOf('.') : -1
      if (dot_index !== -1) {
        space = flags.className.substr(dot_index + 1)
        flags.className = flags.className.substr(0, dot_index)
      }

      this.reorderEntities(app, 'entities')
      this.reorderEntities(app, 'prebuiltEntities')
      this.reorderEntities(app, 'closedLists')
      this.reorderEntities(app, 'regex_entities')
      this.reorderEntities(app, 'patternAnyEntities')
      this.reorderEntities(app, 'composites')

      const outputPath = Utils.validatePath(flags.out, process.cwd(), flags.className + '.cs')

      this.log(
        `Generating file at ${outputPath || ''} that contains class ${space}.${flags.className}.`
      )

      await LuisToCsConverter.writeFromLuisJson(app, flags.className, space, outputPath)

    } catch (err) {
      throw new CLIError(err)
    }
  }
}

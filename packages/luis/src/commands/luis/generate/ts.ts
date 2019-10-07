import {CLIError, Command, flags} from '@microsoft/bf-cli-command'
import {camelCase, kebabCase, upperFirst} from 'lodash'
import * as path from 'path'

import {LuisToTsConverter} from '../../../parser/converters/luis-to-ts-converter'

const file = require('./../../../utils/filehelper')
const fs = require('fs-extra')

export default class LuisGenerateTs extends Command {
  static description = 'Generate:ts generates a strongly typed typescript source code from an exported (json) LUIS model.'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source .lu file(s) or LUIS application JSON model'}),
    out: flags.string({description: 'Output file or folder name. If not specified stdout will be used as output', default: ''}),
    className: flags.string({description: 'Name of the class'}),
    force: flags.boolean({description: 'If --in flag provided with the path to an existing file, overwrites it', default: false}),
  }

  reorderEntities(app: any, name: string): void {
    if (app[name] !== null && app[name] !== undefined) {
      app[name].sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
    }
  }

  async run() {
    const {flags} = this.parse(LuisGenerateTs)
    let stdInput = await this.readStdin()

    const pathPrefix = path.isAbsolute(flags.in) ? '' : process.cwd()
    let app: any
    try {
      app = stdInput ? JSON.parse(stdInput as string) : await fs.readJSON(path.join(pathPrefix, flags.in))
    } catch (err) {
      throw new CLIError(err)
    }

    flags.className = flags.className || app.name
    flags.className = upperFirst(camelCase(flags.className))

    this.reorderEntities(app, 'entities')
    this.reorderEntities(app, 'prebuiltEntities')
    this.reorderEntities(app, 'closedLists')
    this.reorderEntities(app, 'regex_entities')
    this.reorderEntities(app, 'patternAnyEntities')
    this.reorderEntities(app, 'composites')

    const outputPath = file.validatePath(flags.out, kebabCase(flags.className) + '.ts', flags.force)

    this.log(
      `Generating file at ${outputPath || ''} that contains class ${flags.className}.`
    )

    await LuisToTsConverter.writeFromLuisJson(app, flags.className, outputPath)
  }
}

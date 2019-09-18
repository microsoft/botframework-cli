import {Command, flags} from '@microsoft/bf-cli-command'
import * as path from 'path'

import {CSharpTemplate} from '../../../helpers/csharp-template'
import {LuisTransformToClass} from '../../../helpers/luis-to-classes'
import {Utils} from '../../../helpers/utils'

const fs = require('fs-extra')

export default class LuisTransformTocs extends Command {
  static description = 'describe the command here'

  static flags: flags.Input<any> = {
    in: flags.string({description: 'Source .lu file(s) or LUIS application JSON model'}),
    out: flags.string({description: 'Output file or folder name. If not specified stdout will be used as output', default: ''}),
    className: flags.string({description: 'Name of the class', required: true}),
  }

  reorderEntities(app: any, name: string): void {
    if (app[name] !== null && app[name] !== undefined) {
      app[name].sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
    }
  }

  async run() {
    try {
      const {flags} = this.parse(LuisTransformTocs)
      const dot_index = flags.className.indexOf('.')
      let space = 'Luis'
      let stdInput = null

      try {
        stdInput = await this.readStdin()
      } catch {}

      if (dot_index !== -1) {
        space = flags.className.substr(dot_index + 1)
        flags.className = flags.className.substr(0, dot_index)
      }

      const pathPrefix = path.isAbsolute(flags.in) ? '' : process.cwd()
      const app = stdInput ? JSON.parse(stdInput as string) : await fs.readJSON(path.join(pathPrefix, flags.in))

      this.reorderEntities(app, 'entities')
      this.reorderEntities(app, 'prebuiltEntities')
      this.reorderEntities(app, 'closedLists')
      this.reorderEntities(app, 'regex_entities')
      this.reorderEntities(app, 'patternAnyEntities')
      this.reorderEntities(app, 'composites')

      flags.className = flags.className || app.name.replace(' ', '_')

      const description = `tocs ${flags.name} ${space}.${flags.className} -o ${__dirname}`

      const outputPath = Utils.validatePath(flags.out, process.cwd(), flags.className + '.cs')
      this.log(
        `Generating file at ${outputPath || ''} that contains class ${space}.${flags.className}.`
      )
      const result = LuisTransformToClass.fromLuisApp(app)

      await CSharpTemplate.fromLuisObject(result, description, flags.className, space, outputPath)
    } catch (err) {
      this.log(err)
    }
  }
}

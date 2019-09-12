import {Command, flags} from '@microsoft/bf-cli-command'
import * as path from 'path'

import {CSharpTemplate} from '../../../helpers/csharp-template'
import {LuisTransformToClass} from '../../../helpers/luis-to-classes'

const fs = require('fs-extra')

export default class LuisTransformTocs extends Command {
  static description = 'describe the command here'

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Source LUIS application JSON file .OR. source .lu file'}),
    folder: flags.string({char: 'l', description: 'Source folder that contains .lu file(s)'}),
    subFolder: flags.boolean({char: 's', description: 'Indicates if sub-folders need to be considered to file .lu file(s)'}),
    out: flags.string({char: 'o', description: 'Output file name'}),
    outFolder: flags.string({char: 'd', description: 'Output file name'}),
  }

  static args = [{name: 'file', required: true}, {name: 'className', required: true}]

  reorderEntities(app: any, name: string): void {
    if (app[name] !== null && app[name] !== undefined) {
      app[name].sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
    }
  }

  async run() {
    const {args, flags} = this.parse(LuisTransformTocs)
    const dot_index = args.className.indexOf('.')
    let space = 'Luis'

    if (dot_index !== -1) {
      space = args.className.substr(dot_index + 1)
      args.className = args.className.substr(0, dot_index)
    }

    const app = await fs.readJSON(path.join('/Users/axelsuarez/Documents/botframework-cli/packages/luisgen', args.file))

    this.reorderEntities(app, 'entities')
    this.reorderEntities(app, 'prebuiltEntities')
    this.reorderEntities(app, 'closedLists')
    this.reorderEntities(app, 'regex_entities')
    this.reorderEntities(app, 'patternAnyEntities')
    this.reorderEntities(app, 'composites')

    args.className = args.className || app.name.replace(' ', '_')
    flags.out = flags.out || './'
    const description = `tocs ${args.name} ${space}.${args.className} -o ${__dirname}`

    const outName = `${flags.out}/${args.className}.cs`
    this.log(
      `Generating file ${outName} that contains class ${space}.${args.className}.`
    )
    const result = LuisTransformToClass.fromLuisApp(app)

    await CSharpTemplate.fromLuisObject(result, description, args.className, space, outName)
  }
}

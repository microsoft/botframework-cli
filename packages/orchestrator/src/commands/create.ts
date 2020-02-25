/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags, utils} from '@microsoft/bf-cli-command'

export default class OrchestratorCreate extends Command {
  static description = 'Create orchestrator example file from .lu/.qna files to be used for bot runtime'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(OrchestratorCreate)

    const name = flags.name || 'world'
    this.log(`hello ${name} from D:\\src\\botframework-cli\\packages\\orchestrator\\src\\commands\\create.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}

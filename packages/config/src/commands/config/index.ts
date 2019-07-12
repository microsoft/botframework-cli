import {flags} from '@oclif/command'
import {Command} from 'cli-command'

export default class ConfigIndex extends Command {
  static description = 'The config plugin allows users to configure various settings within the cli.'

  static flags = {
    help: flags.help({char: 'h'})
  }

  async run() {}
}

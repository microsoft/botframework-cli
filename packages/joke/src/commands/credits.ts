import {Command, flags} from '@oclif/command'


export default class Credits extends Command {
  static description = 'Display data origin credits'

  static examples = [
    `$ bf joke:credits
Displays data origin credits
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
  }


  async run() {


    const endpoint = 'https://api.chucknorris.io/'
    // just print it:
    this.log('chucknorris.io is a free JSON API for hand curated Chuck Norris facts.');
    this.log('API access via: ' + endpoint);
  }
}

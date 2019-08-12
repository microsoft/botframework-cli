import {Command, flags} from '@oclif/command'
import { Http2ServerRequest } from 'http2';

const fetch = require("node-fetch");

export const http = async (request: RequestInfo): Promise<any> => {
  return new Promise(resolve => {
    fetch(request)
      .then((response: { json: () => void; }) => response.json())
      .then((body: unknown) => {
        resolve(body);
      });
  });
};



export default class Categories extends Command {
  static description = 'Retrieves and displays categories'

  static examples = [
    `$ bf joke:categories
<list of categories>
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]


  async run() {


    const endpoint = 'https://api.chucknorris.io/jokes/categories'
    const cats = await http(endpoint);
    // just print it:
    this.log('Categories:');
    this.log(cats);

    const {args, flags} = this.parse(Categories)
/*
    const name = flags.name || 'world'
    this.log(`hello ${name} from .\\src\\commands\\categories.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
*/
  }
}

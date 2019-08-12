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



export default class Random extends Command {
  static description = 'Retrieves and displays a random joke'

  static examples = [
    `$ bf joke:random   Displays a joke...

`,
  ]



  static flags = {
    category: flags.string({char: 'c', description: 'Show random joke from predefined category retrieved by categories command'}),
    search: flags.string({char: 's', description: 'Show jokes matching simple text pattern'}),
    raw: flags.boolean({char: 'r', description: 'displays raw JSON response'})
  }

  static args = [{name: 'file'}]


  async run() {

    var endpoint = 'https://api.chucknorris.io/jokes/random'
    const srchep = 'https://api.chucknorris.io/jokes/search?query='

    const {args, flags} = this.parse(Random)

    const category = flags.category;
    const search = category == null ? flags.search : null;

    var jokeText = "N/A"
    var jokeUrl = "N/A"
    var jokeCategory = "N/A"

    if(category != null)
    {
      endpoint += "?category=" + category; 
    }
    else if(search != null)
    {
      endpoint = srchep + search; 
    }

    this.log('EP: ' + endpoint)
    

    var aJoke = await http(endpoint);
    // this.log(aJoke);      
    jokeText = aJoke["value"];      
    jokeUrl = aJoke["url"]
    jokeCategory = aJoke["categories"]

    if(flags.raw)
    {
      // Show raw JSON response
      this.log(aJoke);
    }
    else if(search != null)
    {
      Object.entries(aJoke["result"]).forEach(([key, value]) => {
//        this.log(`key= ${key} value = ${value}`)
        var result = value;
        this.log(`--- [${key}] ---`)
        this.log("Joke:\t" + result["value"]);
        this.log("Url:\t" + result["url"])
        this.log("Category:\t" + result["categories"])
     })      
    }
    else
    {
      // Show joke
      this.log("Joke:\t" + jokeText);
      this.log("Url:\t" + jokeUrl)
      this.log("Category:\t" + jokeCategory)
    }




    /*
    const name = flags.name || 'world'
    this.log(`hello ${name} from .\\src\\commands\\categories.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
*/
  }
}

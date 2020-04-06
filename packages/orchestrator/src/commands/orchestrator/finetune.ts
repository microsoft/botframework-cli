import {Command, flags} from '@microsoft/bf-cli-command'
import * as path from 'path';

export default class OrchestratorFinetune extends Command {
  static description = 'Finetune an Orchestrator model'

  static examples = [`
    $ bf orchestrator:finetune 
    $ bf orchestrator:finetune --in ./path/to/file/
    $ bf orchestrator:finetune --in ./path/to/file/ -o ./path/to/output/`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'The path to .lu/.qna files from where orchestrator example file will be created from. Default to current working directory.'}),
    out: flags.string({char: 'o', description: 'Path where generated orchestrator example file will be placed. Default to current working directory.'}),
    force: flags.boolean({char: 'f', description: 'If --out flag is provided with the path to an existing file, overwrites that file.', default: false}),
    help: flags.help({char: 'h', description: 'Orchestrator create command help'}),
  }

  async run(): Promise<number> {
    const {flags} = this.parse(OrchestratorFinetune);

    const input = flags.in || __dirname;
    const output = flags.out || __dirname;

    const args = `finetune -i ${input} -o ${output}`;
    this.log(`arguments -- ${args}`);

    // TO-DO: figure out rush package dependency with regard to oclif folder structure
    // require("dotnet-3.1") statement works only for local package install
    // process.argv= [process.argv[0], process.argv[1], __dirname + '/netcoreapp3.1/OrchestratorCli.dll', ...process.argv.slice(2)]
    // require("dotnet-3.1")
    this.log(`Input is ${input}`);

    try {
      require('child_process').execSync('dotnet "' + path.join(...[__dirname, 'netcoreapp3.1', 'OrchestratorCli.dll']) + '" ' + args, {stdio: [0, 1, 2]});
    } catch (error) {
      return 1;
    }
    return 0;
  }
}

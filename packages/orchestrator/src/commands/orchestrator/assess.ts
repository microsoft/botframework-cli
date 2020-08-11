/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import * as path from 'path';
import {Command, CLIError, flags} from '@microsoft/bf-cli-command';
import {Orchestrator, Utility} from '@microsoft/bf-orchestrator';
import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

export default class OrchestratorAssess extends Command {
  static description: string = 'Assess utterance/label samples from an input file and create an evaluation report';

  static examples: Array<string> = [`
    $ bf orchestrator:evaluate 
    $ bf orchestrator:evaluate --in ./path/to/file/
    $ bf orchestrator:evaluate --in ./path/to/file/ --out ./path/to/output/`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to a previously created Orchestrator .blu file.'}),
    prediction: flags.string({char: 't', description: 'Path to a prediction file.'}),
    out: flags.string({char: 'o', description: 'Directory where analysis and output files will be placed.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorAssess);

    const inputPath: string = flags.in;
    const predictionPath: string = flags.prediction;
    const outputPath: string = flags.out;

    Utility.toPrintDebuggingLogToConsole = flags.debug;
    UtilityDispatcher.toPrintDebuggingLogToConsole = flags.debug;

    Utility.debuggingLog(`OrchestratorAssess.run(): inputPath=${inputPath}`);
    Utility.debuggingLog(`OrchestratorAssess.run(): predictionPath=${predictionPath}`);
    Utility.debuggingLog(`OrchestratorAssess.run(): outputPath=${outputPath}`);

    try {
      await Orchestrator.assessAsync(
        inputPath, predictionPath, outputPath);
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }
}

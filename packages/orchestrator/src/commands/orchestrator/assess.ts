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
    $ bf orchestrator:assess --in=./path/to/ground-truth/file --prediction=./path/to/prediction/file --out=./path/to/output/folder/`]

  static flags: flags.Input<any> = {
    in: flags.string({char: 'i', description: 'Path to a ground-truth label file, or comma-separated paths to a collection of files -- most uselful for crosss-valiaton.'}),
    prediction: flags.string({char: 't', description: 'Path to a prediction label file, or comma-separated paths to a collection of files -- most uselful for crosss-valiaton.'}),
    out: flags.string({char: 'o', description: 'Directory where analysis and output files will be placed.'}),
    debug: flags.boolean({char: 'd'}),
    help: flags.help({char: 'h'}),
  }

  async run(): Promise<number> {
    const {flags}: flags.Output = this.parse(OrchestratorAssess);

    const inputPathConfiguration: string = flags.in;
    const predictionPathConfiguration: string = flags.prediction;
    const outputPath: string = flags.out;

    Utility.toPrintDebuggingLogToConsole = flags.debug;
    UtilityDispatcher.toPrintDebuggingLogToConsole = flags.debug;

    Utility.debuggingLog(`OrchestratorAssess.run(): inputPathConfiguration=${inputPathConfiguration}`);
    Utility.debuggingLog(`OrchestratorAssess.run(): predictionPathConfiguration=${predictionPathConfiguration}`);
    Utility.debuggingLog(`OrchestratorAssess.run(): outputPath=${outputPath}`);

    try {
      await Orchestrator.assessAsync(
        inputPathConfiguration, predictionPathConfiguration, outputPath);
    } catch (error) {
      throw (new CLIError(error));
    }
    return 0;
  }
}
